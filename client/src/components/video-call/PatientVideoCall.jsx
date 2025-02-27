"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Peer from "simple-peer";
import { socket } from "@/utils/socket";
import api from "@/utils/api";
import { VideoCallUI } from "./video-call-ui";
import {
  setupVideoElement,
  checkVideoStream,
  getOptimalVideoConstraints,
} from "@/utils/video-helpers";

export default function PatientVideoCallPage() {
  const { id: appointmentId } = useParams();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || `appointment-${appointmentId}`;
  const router = useRouter();

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [screenShare, setScreenShare] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [videoError, setVideoError] = useState(null);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const screenVideo = useRef(null);
  const connectionRef = useRef(null);
  const messageInput = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("profile"));
        const storedRole = localStorage.getItem("role");

        setUserId(storedUser.id);
        setUserRole(storedRole);

        socket.emit("register_user", {
          userId: storedUser.id,
          userRole: storedRole,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchConsultationDetails = async () => {
      try {
        const { data } = await api.get(`/video-consultation/${appointmentId}`);
        setConsultationDetails(data);
      } catch (error) {
        console.error("Error fetching consultation details:", error);
      }
    };

    fetchUserInfo();
    fetchConsultationDetails();
  }, [appointmentId]);

  useEffect(() => {
    const setupMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          getOptimalVideoConstraints()
        );

        setStream(stream);
        streamRef.current = stream;

        if (!checkVideoStream(stream)) {
          setVideoError("Video stream is not available or active");
          setIsVideoOff(true);
        }

        if (myVideo.current) {
          setupVideoElement(myVideo.current, stream, true);
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setVideoError(err.message || "Failed to access camera");

        if (err.name === "NotAllowedError") {
          alert("Please allow access to your camera and microphone.");
        } else if (err.name === "NotFoundError") {
          alert("No camera detected. Please connect a camera and try again.");
          setIsVideoOff(true);
        }
      }
    };

    setupMediaStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (screenShare) {
        screenShare.getTracks().forEach((track) => track.stop());
      }

      if (callEnded && connectionRef.current) {
        console.log("Call ended, destroying peer connection.");
        if (typeof connectionRef.current.destroy === "function") {
          connectionRef.current.destroy();
        }
        connectionRef.current = null;
      }
    };
  }, [screenShare]);

  useEffect(() => {
    if (!roomId || !userId || !userRole) return;

    socket.emit("join_appointment_room", {
      appointmentId,
      userId,
      userRole,
    });

    socket.on("room_participants", (participants) => {
      console.log("Room participants:", participants);

      if (participants.length > 1) {
        const otherParticipant = participants.find(
          (p) => p.socketId !== socket.id
        );

        if (otherParticipant) {
          console.log("Found other participant:", otherParticipant);
          setRemoteSocketId(otherParticipant.socketId);
        }
      }
    });

    socket.on("call_initiated", ({ fromUserId, fromUserRole }) => {
      console.log(`Receiving call from ${fromUserRole} ${fromUserId}`);
      setReceivingCall(true);
    });

    socket.on("offer", ({ offer, from }) => {
      console.log("Received offer from:", from);
      setRemoteSocketId(from);
      setReceivingCall(true);

      connectionRef.current = { offer, from };
      console.log("Offer stored:", connectionRef.current);
    });

    socket.on("answer", (answer) => {
      console.log("Received answer:", answer);
      if (connectionRef.current && connectionRef.current.signal) {
        try {
          connectionRef.current.signal(answer);
          setCallAccepted(true);
        } catch (err) {
          console.error("Error signaling answer:", err);
        }
      }
    });

    socket.on("ice_candidate", (candidate) => {
      console.log("Received ICE candidate");
      if (connectionRef.current && connectionRef.current.addIceCandidate) {
        connectionRef.current.addIceCandidate(candidate);
      }
    });

    socket.on("user_left", ({ userId, userRole }) => {
      console.log(`User left: ${userRole} ${userId}`);
      if (callAccepted && !callEnded) {
        setCallEnded(true);

        if (connectionRef.current) {
          if (
            connectionRef.current.peer &&
            typeof connectionRef.current.peer.destroy === "function"
          ) {
            connectionRef.current.peer.destroy();
          } else if (typeof connectionRef.current.destroy === "function") {
            connectionRef.current.destroy();
          }
        }

        if (userVideo.current) {
          userVideo.current.srcObject = null;
        }
      }
    });

    socket.on("receive_message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socket.off("room_participants");
      socket.off("call_initiated");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
      socket.off("user_left");
      socket.off("receive_message");
    };
  }, [roomId, userId, userRole, appointmentId, callAccepted, callEnded]);

  const answerCall = useCallback(() => {
    if (
      !streamRef.current ||
      !connectionRef.current ||
      !connectionRef.current.offer
    ) {
      console.error("Cannot answer call: missing stream or offer");
      return;
    }

    console.log("Answering call with offer:", connectionRef.current.offer);
    console.log("Sending answer to:", connectionRef.current.from);

    const fromSocketId = connectionRef.current.from;
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: streamRef.current,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
      },
    });

    peer.on("signal", (data) => {
      console.log("Generated answer, sending to:", fromSocketId);
      if (!fromSocketId) {
        console.error("Cannot answer call: missing from socket ID");
        return;
      }
      socket.emit("answer", {
        answer: data,
        roomId,
        toSocketId: fromSocketId,
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (userVideo.current) {
        setupVideoElement(userVideo.current, remoteStream);
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
      alert(`Connection error: ${err.message}. Try refreshing the page.`);
    });

    peer.signal(connectionRef.current.offer);

    connectionRef.current = peer;
  }, [roomId]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);

        if (isVideoOff && !checkVideoStream(streamRef.current)) {
          navigator.mediaDevices
            .getUserMedia(getOptimalVideoConstraints())
            .then((newStream) => {
              const newVideoTrack = newStream.getVideoTracks()[0];
              const oldVideoTrack = streamRef.current.getVideoTracks()[0];

              if (oldVideoTrack) {
                streamRef.current.removeTrack(oldVideoTrack);
                oldVideoTrack.stop();
              }

              streamRef.current.addTrack(newVideoTrack);

              if (myVideo.current) {
                setupVideoElement(myVideo.current, streamRef.current, true);
              }

              if (connectionRef.current && connectionRef.current.replaceTrack) {
                connectionRef.current.replaceTrack(
                  oldVideoTrack,
                  newVideoTrack,
                  streamRef.current
                );
              }
            })
            .catch((err) => {
              console.error("Error restarting video:", err);
              setVideoError("Could not restart video: " + err.message);
              setIsVideoOff(true);
            });
        }
      }
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Screen sharing only needs video
        audio: false,
      });

      setScreenShare(screenStream);
      const screenTrack = screenStream.getVideoTracks()[0];

      screenTrack.onended = () => {
        stopScreenShare();
      };

      if (!connectionRef.current) {
        console.error("Peer connection is not initialized.");
        alert("Screen share failed: No active call.");
        return;
      }

      const peer = connectionRef.current;

      if (peer.streams[0]) {
        const oldVideoTrack = peer.streams[0].getVideoTracks()[0];
        if (oldVideoTrack) {
          peer.replaceTrack(oldVideoTrack, screenTrack, peer.streams[0]);
        }
      }

      if (screenVideo.current) {
        screenVideo.current.srcObject = screenStream;
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
      alert("Could not share screen: " + err.message);
    }
  };

  const stopScreenShare = () => {
    if (!screenShare) return;

    screenShare.getTracks().forEach((track) => track.stop());

    if (!connectionRef.current) {
      console.warn("Peer connection is already closed.");
      return;
    }

    const peer = connectionRef.current;

    const cameraTrack = streamRef.current?.getVideoTracks()[0];

    if (!cameraTrack) {
      console.warn("No camera track available to replace screen share.");
      return;
    }

    const screenTrack = screenShare.getVideoTracks()[0];

    if (peer.streams[0] && screenTrack) {
      peer.replaceTrack(screenTrack, cameraTrack, peer.streams[0]);

      console.log("Replaced screen share track with camera track.");
    }

    setScreenShare(null);

    if (myVideo.current) {
      myVideo.current.srcObject = streamRef.current;
    }

    console.log("Stopped screen sharing and restored camera feed.");
  };

  const sendMessage = (text) => {
    if (!roomId || !text.trim()) return;

    socket.emit("send_message", {
      roomId,
      message: text,
      fromUserId: userId,
      fromUserRole: userRole,
    });
  };

  const leaveCall = () => {
    setCallEnded(true);

    socket.emit("leave_call", {
      roomId,
      userId,
      userRole,
    });

    if (connectionRef.current) {
      if (typeof connectionRef.current.destroy === "function") {
        connectionRef.current.destroy();
      } else if (
        connectionRef.current.peer &&
        typeof connectionRef.current.peer.destroy === "function"
      ) {
        connectionRef.current.peer.destroy();
      }
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    setCallAccepted(false);
    router.push("/");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (messageInput.current && messageInput.current.value.trim()) {
      sendMessage(messageInput.current.value);
      messageInput.current.value = "";
    }
  };

  return (
    <VideoCallUI
      myVideo={myVideo}
      userVideo={userVideo}
      screenVideo={screenVideo}
      stream={streamRef.current}
      screenShare={screenShare}
      callAccepted={callAccepted}
      callEnded={callEnded}
      receivingCall={receivingCall}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      messages={messages}
      onAnswer={answerCall}
      onCall={() => {}}
      onLeave={leaveCall}
      onToggleMute={toggleMute}
      onToggleVideo={toggleVideo}
      onShareScreen={shareScreen}
      onStopShare={stopScreenShare}
      onSendMessage={sendMessage}
      onToggleChat={toggleChat}
      isChatOpen={isChatOpen}
      messageInput={messageInput}
      onSubmitMessage={onSubmitMessage}
      socket={socket}
      consultationDetails={consultationDetails}
      isPatient={true}
      videoError={videoError}
    />
  );
}
