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
  Shield,
  Clock,
  Calendar,
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
  const remoteUserInitials = isPatient
    ? consultationDetails?.doctor_first_name?.charAt(0) +
      consultationDetails?.doctor_last_name?.charAt(0)
    : consultationDetails?.patient_first_name?.charAt(0) +
      consultationDetails?.patient_last_name?.charAt(0);

  const remoteUserName = isPatient
    ? `Dr. ${consultationDetails?.doctor_first_name} ${consultationDetails?.doctor_last_name}`
    : `${consultationDetails?.patient_first_name} ${consultationDetails?.patient_last_name}`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
              {remoteUserInitials || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {remoteUserName || "Loading..."}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                {consultationDetails && (
                  <>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-3">
                      {format(
                        new Date(consultationDetails.appointment_date),
                        "PPP"
                      )}
                    </span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {format(
                        new Date(consultationDetails.appointment_date),
                        "p"
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center">
              <Shield className="w-4 h-4 text-teal-600 mr-1" />
              <span className="text-sm text-teal-600 font-medium">
                Secure Connection
              </span>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                callAccepted && !callEnded
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  callAccepted && !callEnded ? "bg-green-500" : "bg-amber-500"
                } mr-2 animate-pulse`}
              ></span>
              {callAccepted && !callEnded ? "Connected" : "Waiting"}
            </span>
            <button
              onClick={onToggleChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
              {messages.length > 0 && !isChatOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {messages.length > 9 ? "9+" : messages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          {/* My Video */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-gray-200 h-full">
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ backgroundColor: "black" }}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                <div className="text-white text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <CameraOff className="w-10 h-10" />
                  </div>
                  <p className="font-medium">Your camera is off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
              You{" "}
              {isMuted && (
                <MicOff className="w-4 h-4 ml-1 inline-block text-red-400" />
              )}
            </div>

            {/* Video status indicators */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {isMuted && (
                <div className="bg-red-500/80 backdrop-blur-sm text-white p-1.5 rounded-lg">
                  <MicOff className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Remote Video */}
          {callAccepted && !callEnded ? (
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-gray-200 h-full">
              <video
                ref={userVideo}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ backgroundColor: "black" }}
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                {remoteUserName || "Remote User"}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl h-full">
              <div className="text-center text-gray-300 px-6">
                <div className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Phone className="w-10 h-10" />
                </div>
                <p className="text-xl font-medium mb-2">
                  Waiting to connect...
                </p>
                <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                  {isPatient
                    ? "Your doctor will join the call shortly. Please stay on this page."
                    : "Waiting for the patient to join the consultation."}
                </p>
                {!callAccepted && !receivingCall && !isPatient && (
                  <button
                    onClick={onCall}
                    className="mt-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Call
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Screen Share Overlay */}
          {screenShare && (
            <div className="absolute inset-0 z-50 bg-gray-900 flex flex-col">
              <video
                ref={screenVideo}
                autoPlay
                playsInline
                muted
                style={{
                  display: screenShare ? "block" : "none",
                  width: "100%",
                  height: "auto",
                }}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={onStopShare}
                  className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 shadow-lg flex items-center space-x-2"
                >
                  <span>Stop Sharing</span>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-24 flex items-center justify-center gap-4 md:gap-6 bg-white border-t border-gray-200 px-4">
          <button
            className={`p-4 rounded-full transition-all shadow-md ${
              isMuted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <button
            className={`p-4 rounded-full transition-all shadow-md ${
              isVideoOff
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={onToggleVideo}
            title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {isVideoOff ? (
              <CameraOff className="w-6 h-6" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </button>
          <button
            className={`p-4 rounded-full transition-all shadow-md ${
              screenShare
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={screenShare ? onStopShare : onShareScreen}
            title={screenShare ? "Stop Sharing" : "Share Screen"}
          >
            <MonitorUp className="w-6 h-6" />
          </button>
          <button
            className={`p-4 rounded-full transition-all shadow-md ${
              callAccepted && !callEnded
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
            }`}
            onClick={callAccepted && !callEnded ? onLeave : onCall}
            title={callAccepted && !callEnded ? "End Call" : "Start Call"}
          >
            {callAccepted && !callEnded ? (
              <PhoneOff className="w-6 h-6" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
            <h3 className="font-semibold text-lg">Chat</h3>
            <button
              onClick={onToggleChat}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                      message.fromUserId === socket.id
                        ? "ml-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-white" // Your messages
                        : message.fromUserRole === "doctor"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" // Doctor's messages
                        : "bg-white border border-gray-200 text-gray-800" // Patient's messages
                    }`}
                  >
                    {message.message || message.text}
                    <div className="text-xs opacity-70 mt-1.5 flex justify-end">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={onSubmitMessage}
            className="p-4 border-t border-gray-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                ref={messageInput}
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2.5 bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Incoming Call Modal */}
      {receivingCall && !callAccepted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-bounce-slow">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Phone className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Incoming Call
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {consultationDetails
                ? `Dr. ${consultationDetails.doctor_first_name} ${consultationDetails.doctor_last_name} is calling...`
                : "A doctor is calling..."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={onLeave}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Decline
              </button>
              <button
                onClick={onAnswer}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-colors font-medium shadow-md"
              >
                Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
