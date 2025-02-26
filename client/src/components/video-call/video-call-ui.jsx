import {
  Camera,
  CameraOff,
  MessageCircle,
  Mic,
  MicOff,
  MonitorUp,
  Phone,
  PhoneOff,
  X,
} from "lucide-react";
import { format } from "date-fns";

export function VideoCallUI({
  myVideo,
  userVideo,
  screenVideo,
  stream,
  screenShare,
  callAccepted,
  callEnded,
  receivingCall,
  isMuted,
  isVideoOff,
  messages,
  isChatOpen,
  messageInput,
  onAnswer,
  onCall,
  onLeave,
  onToggleMute,
  onToggleVideo,
  onShareScreen,
  onStopShare,
  onSubmitMessage,
  onToggleChat,
  socket,
  consultationDetails,
  isPatient,
  isDoctor,
}) {
  // Determine which user info to show based on role
  const remoteUserInitials = isPatient
    ? consultationDetails?.doctor_first_name?.charAt(0) +
      consultationDetails?.doctor_last_name?.charAt(0)
    : consultationDetails?.patient_first_name?.charAt(0) +
      consultationDetails?.patient_last_name?.charAt(0);

  const remoteUserName = isPatient
    ? `Dr. ${consultationDetails?.doctor_first_name} ${consultationDetails?.doctor_last_name}`
    : `${consultationDetails?.patient_first_name} ${consultationDetails?.patient_last_name}`;

  return (
    <div className="flex h-screen bg-gradient-to-b from-cyan-50 to-blue-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
              {remoteUserInitials || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {remoteUserName || "Loading..."}
              </h3>
              <p className="text-sm text-gray-500">
                {consultationDetails
                  ? `${consultationDetails.reason} - ${format(
                      new Date(consultationDetails.appointment_date),
                      "PPP"
                    )}`
                  : "Medical Consultation"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {callAccepted ? "Connected" : "Waiting"}
            </span>
            <button
              onClick={onToggleChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 grid grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
              You
            </div>
          </div>

          {callAccepted && !callEnded ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
              <video
                ref={userVideo}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                {remoteUserName || "Remote User"}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Waiting to connect...</p>
                {!callAccepted && !receivingCall && !isPatient && (
                  <button
                    onClick={onCall}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition-all"
                  >
                    Start Call
                  </button>
                )}
              </div>
            </div>
          )}

          {screenShare && (
            <div className="absolute inset-0 bg-gray-900">
              <video
                ref={screenVideo}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <button
                onClick={onStopShare}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >
                Stop Sharing
              </button>
            </div>
          )}
        </div>

        <div className="h-24 flex items-center justify-center gap-4 bg-white border-t border-gray-200">
          <button
            className={`p-4 rounded-full transition-all ${
              isMuted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={onToggleMute}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <button
            className={`p-4 rounded-full transition-all ${
              isVideoOff
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={onToggleVideo}
          >
            {isVideoOff ? (
              <CameraOff className="w-6 h-6" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </button>
          <button
            className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            onClick={screenShare ? onStopShare : onShareScreen}
          >
            <MonitorUp className="w-6 h-6" />
          </button>
          <button
            className={`p-4 rounded-full transition-all ${
              callAccepted && !callEnded
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
            onClick={callAccepted && !callEnded ? onLeave : onCall}
          >
            {callAccepted && !callEnded ? (
              <PhoneOff className="w-6 h-6" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isChatOpen && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <button
              onClick={onToggleChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.fromUserId === socket.id
                      ? "ml-auto bg-teal-500 text-white" // Your messages
                      : message.fromUserRole === "doctor"
                      ? "bg-blue-500 text-white" // Doctor's messages
                      : "bg-gray-100 text-gray-900" // Patient's messages
                  }`}
                >
                  {message.message || message.text}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={onSubmitMessage}
            className="p-4 border-t border-gray-200"
          >
            <div className="flex gap-2">
              <input
                ref={messageInput}
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {receivingCall && !callAccepted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Incoming Call
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {consultationDetails
                ? `${consultationDetails.doctor_first_name} ${consultationDetails.doctor_last_name} is calling...`
                : "A doctor is calling..."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onAnswer}
                className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Answer
              </button>
              <button
                onClick={onLeave}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
