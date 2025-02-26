"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Peer from "simple-peer";
import { socket } from "@/utils/socket";
import api from "@/utils/api";
import { VideoCallUI } from "./video-call-ui";

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

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const screenVideo = useRef(null);
  const connectionRef = useRef(null);
  const messageInput = useRef(null);
  const streamRef = useRef(null);

  // Fetch user info and consultation details
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("profile"));
        const storedRole = localStorage.getItem("role");

        setUserId(storedUser.id);
        setUserRole(storedRole);

        // Register with socket
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

  // Setup media stream
  useEffect(() => {
    const setupMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
        streamRef.current = mediaStream;

        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (err.name === "NotAllowedError") {
          alert("Please allow access to your camera and microphone.");
        }
      }
    };

    setupMediaStream();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (screenShare) {
        screenShare.getTracks().forEach((track) => track.stop());
      }

      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [screenShare]);

  // Join room and setup socket listeners
  useEffect(() => {
    if (!roomId || !userId || !userRole) return;

    // Join the appointment room
    socket.emit("join_appointment_room", {
      appointmentId,
      userId,
      userRole,
    });

    // Listen for room participants
    socket.on("room_participants", (participants) => {
      console.log("Room participants:", participants);

      if (participants.length > 1) {
        // Find the other participant (not us)
        const otherParticipant = participants.find(
          (p) => p.socketId !== socket.id
        );

        if (otherParticipant) {
          console.log("Found other participant:", otherParticipant);
          setRemoteSocketId(otherParticipant.socketId);

          // If we're the doctor and we haven't initiated a call yet, we can auto-start
          if (userRole === "doctor" && !callInitiated && !callAccepted) {
            setCallInitiated(true);
          }
        }
      }
    });

    // Listen for call initiation
    socket.on("call_initiated", ({ fromUserId, fromUserRole }) => {
      console.log(`Receiving call from ${fromUserRole} ${fromUserId}`);
      setReceivingCall(true);
    });

    // WebRTC signaling
    socket.on("offer", ({ offer, from }) => {
      console.log("Received offer from:", from);
      setRemoteSocketId(from);
      setReceivingCall(true);

      // Store the offer for later use when answering
      connectionRef.current = { offer, from };
      console.log("Offer stored:", connectionRef.current);
    });

    socket.on("answer", (answer) => {
      console.log("Received answer:", answer);
      if (connectionRef.current && connectionRef.current.signal) {
        // Make sure we're using the signal method correctly
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

    // Chat messages
    socket.on("receive_message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    // Cleanup socket listeners
    return () => {
      socket.off("room_participants");
      socket.off("call_initiated");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
      socket.off("receive_message");
    };
  }, [roomId, userId, userRole, appointmentId, callInitiated, callAccepted]);

  // Call user function
  const callUser = useCallback(() => {
    if (!streamRef.current || !remoteSocketId) {
      console.log("Cannot call: missing stream or remote socket ID");
      return;
    }

    setCallInitiated(true);
    console.log("Initiating call to:", remoteSocketId);

    // Notify the other user we're calling
    socket.emit("initiate_call", {
      appointmentId,
      fromUserId: userId,
      fromUserRole: userRole,
    });

    // Create peer connection as initiator
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: streamRef.current,
    });

    // Handle signaling events
    peer.on("signal", (data) => {
      console.log("Generated offer, sending to:", remoteSocketId);
      socket.emit("offer", {
        offer: data,
        roomId,
        toSocketId: remoteSocketId,
      });
    });

    // Handle incoming stream
    peer.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        // Force play the video
        userVideo.current.play().catch((err) => {
          console.error("Error playing remote video:", err);
        });
      }
    });

    // Handle errors
    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    // Store the peer connection
    connectionRef.current = peer;
  }, [appointmentId, userId, userRole, remoteSocketId, roomId]);

  // Answer call function
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

    // Create peer connection as receiver
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: streamRef.current,
    });

    // Handle signaling events
    peer.on("signal", (data) => {
      if(!connectionRef.current.from) {
        console.error("Cannot answer call: missing from socket ID");
        return
      }
      console.log("Generated answer, sending to:", connectionRef.current);
      socket.emit("answer", {
        answer: data,
        roomId,
        toSocketId: connectionRef.current.from,
      });
    });

    // Handle incoming stream
    peer.on("stream", (remoteStream) => {
      console.log("Received remote stream");
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        // Force play the video
        userVideo.current.play().catch((err) => {
          console.error("Error playing remote video:", err);
        });
      }
    });

    // Handle errors
    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    // Signal with the stored offer
    peer.signal(connectionRef.current.offer);

    // Replace the connection reference with the peer
    connectionRef.current = peer;
  };

  // Toggle mute function
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  // Toggle video function
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  // Share screen function
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setScreenShare(screenStream);

      if (screenVideo.current) {
        screenVideo.current.srcObject = screenStream;
      }

      // If we're in a call, replace the video track with screen share
      if (connectionRef.current && connectionRef.current.getSenders) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const senders = connectionRef.current.getSenders();
        const sender = senders.find((s) => s.track && s.track.kind === "video");
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  // Stop screen share function
  const stopScreenShare = () => {
    if (screenShare) {
      screenShare.getTracks().forEach((track) => track.stop());
      setScreenShare(null);

      // Replace screen share track with camera track
      if (
        connectionRef.current &&
        connectionRef.current.getSenders &&
        streamRef.current
      ) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        const senders = connectionRef.current.getSenders();
        const sender = senders.find((s) => s.track && s.track.kind === "video");
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
    }
  };

  // Send message function
  const sendMessage = (text) => {
    if (!roomId || !text.trim()) return;

    socket.emit("send_message", {
      roomId,
      message: text,
      fromUserId: userId,
      fromUserRole: userRole,
    });
  };

  // Leave call function
  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    // Update consultation status
    if (consultationDetails?.id) {
      api.put(`/video-consultation/${consultationDetails.id}/status`, {
        status: "completed",
      });
    }

    // Redirect back to appointments
    router.push("/appointments");
  };

  // Toggle chat function
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Submit message function
  const onSubmitMessage = (e) => {
    e.preventDefault();
    if (messageInput.current && messageInput.current.value.trim()) {
      sendMessage(messageInput.current.value);
      messageInput.current.value = "";
    }
  };

  // Auto-start call if we're the doctor
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
      isDoctor={true} // Add this prop to customize UI for doctor
    />
  );
}
