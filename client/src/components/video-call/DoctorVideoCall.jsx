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

export default function DoctorVideoCallPage() {
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
  const [callInitiated, setCallInitiated] = useState(false);
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

      if (connectionRef.current) {
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

          if (userRole === "doctor" && !callInitiated && !callAccepted) {
            setCallInitiated(true);
          }
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

        if (
          connectionRef.current &&
          typeof connectionRef.current.destroy === "function"
        ) {
          connectionRef.current.destroy();
          connectionRef.current = null;
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
  }, [
    roomId,
    userId,
    userRole,
    appointmentId,
    callInitiated,
    callAccepted,
    callEnded,
  ]);

  const callUser = useCallback(() => {
    if (!streamRef.current || !remoteSocketId) {
      console.log("Cannot call: missing stream or remote socket ID");
      return;
    }

    setCallInitiated(true);
    console.log("Initiating call to:", remoteSocketId);

    socket.emit("initiate_call", {
      appointmentId,
      fromUserId: userId,
      fromUserRole: userRole,
    });

    const peer = new Peer({
      initiator: true,
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
      console.log("Generated offer, sending to:", remoteSocketId);
      socket.emit("offer", {
        offer: data,
        roomId,
        toSocketId: remoteSocketId,
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

    connectionRef.current = peer;
  }, [appointmentId, userId, userRole, remoteSocketId, roomId]);

  const answerCall = () => {
    if (
      !streamRef.current ||
      !connectionRef.current ||
      !connectionRef.current.offer ||
      !connectionRef.current.from
    ) {
      console.error("Cannot answer call: missing stream or offer");
      return;
    }

    console.log("Answering call with offer:", connectionRef.current.offer);
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
      if (!connectionRef.current.from) {
        console.error("Cannot answer call: missing from socket ID");
        return;
      }
      console.log("Generated answer, sending to:", connectionRef.current);
      socket.emit("answer", {
        answer: data,
        roomId,
        toSocketId: connectionRef.current.from,
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
  };

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
        video: {
          cursor: "always",
          displaySurface: "monitor",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setScreenShare(screenStream);

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopScreenShare();
      });

      if (connectionRef.current) {
        const videoTrack = screenStream.getVideoTracks()[0];

        const senders = connectionRef.current.getSenders();
        const videoSender = senders.find(
          (sender) => sender.track && sender.track.kind === "video"
        );

        if (videoSender) {
          const originalTrack = videoSender.track;

          videoSender.replaceTrack(videoTrack);

          screenShare.originalTrack = originalTrack;
        }
      }

      if (screenVideo.current) {
        screenVideo.current.srcObject = screenStream;
        await screenVideo.current.play().catch((err) => {
          console.error("Error playing screen share:", err);
        });
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
      alert("Could not share screen: " + err.message);
    }
  };

  const stopScreenShare = () => {
    if (screenShare) {
      screenShare.getTracks().forEach((track) => track.stop());

      if (screenShare.originalTrack && connectionRef.current) {
        const senders = connectionRef.current.getSenders();
        const videoSender = senders.find(
          (sender) => sender.track && sender.track.kind === "video"
        );

        if (videoSender) {
          videoSender.replaceTrack(screenShare.originalTrack);
        }
      }

      setScreenShare(null);

      if (screenVideo.current) {
        screenVideo.current.srcObject = null;
      }
    }
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
      }
      connectionRef.current = null;
    }

    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    setCallAccepted(false);
    router.push(`/appointments/${appointmentId}`);
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

  useEffect(() => {
    if (
      userRole === "doctor" &&
      streamRef.current &&
      remoteSocketId &&
      !callAccepted &&
      !callEnded &&
      callInitiated
    ) {
      const timer = setTimeout(() => {
        callUser();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    userRole,
    remoteSocketId,
    callAccepted,
    callEnded,
    callInitiated,
    callUser,
  ]);

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
      onCall={callUser}
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
      isDoctor={true}
      videoError={videoError}
    />
  );
}
