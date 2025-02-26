import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import pkg from "pg";
import { initDB, runSeedScript } from "./db/index.js";
import authRouter from "./routes/auth.js";
import articleRouter from "./routes/article.js";
import appointmentRouter from "./routes/appointment.js";
import doctorRouter from "./routes/doctor.js";
import dashboardRouter from "./routes/dashboard.js";
import prescriptionRouter from "./routes/prescription.js";
import reviewRouter from "./routes/review.js";
import patientManagementRouter from "./routes/patientManagementDashboard.js";
import videoConsultationRouter from "./routes/consultation.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3000/*"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/*"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(express.json());

const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

initDB(pool);
runSeedScript(pool);

app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/dashboard", patientManagementRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/review", reviewRouter);
app.use("/api/video-consultation", videoConsultationRouter);

const activeUsers = new Map();
const roomParticipants = new Map();

io.on("connection", (socket) => {
  console.log("New connection:", socket.id)

  socket.on("register_user", ({ userId, userRole }) => {
    console.log(`Registering user: ${userId} (${userRole}) with socket: ${socket.id}`)
    activeUsers.set(userId, { socketId: socket.id, userRole })
  })

  socket.on("join_appointment_room", ({ appointmentId, userId, userRole }) => {
    const roomId = `appointment-${appointmentId}`
    console.log(`${userRole} ${userId} joining room: ${roomId}`)

    socket.join(roomId)

    if (!roomParticipants.has(roomId)) {
      roomParticipants.set(roomId, new Map())
    }

    // Store with role prefix to ensure uniqueness
    const uniqueUserId = `${userRole}-${userId}`
    roomParticipants.get(roomId).set(uniqueUserId, {
      socketId: socket.id,
      userRole,
      userId,
    })

    console.log("Room participants:", Array.from(roomParticipants.get(roomId).entries()))

    // Notify all users in the room about participants
    const participants = Array.from(roomParticipants.get(roomId).entries()).map(([id, data]) => ({
      userId: id,
      userRole: data.userRole,
      socketId: data.socketId,
    }))

    io.to(roomId).emit("room_participants", participants)
  })

  socket.on("initiate_call", ({ appointmentId, fromUserId, fromUserRole }) => {
    const roomId = `appointment-${appointmentId}`
    console.log(`${fromUserRole} ${fromUserId} initiating call in room: ${roomId}`)

    socket.to(roomId).emit("call_initiated", {
      fromUserId,
      fromUserRole,
      appointmentId,
    })
  })

  socket.on("offer", ({ offer, roomId, toSocketId }) => {
    console.log(`Sending offer from ${socket.id} to ${toSocketId} in room ${roomId}`)

    // Send directly to the recipient socket
    io.to(toSocketId).emit("offer", {
      offer,
      from: socket.id,
    })
  })

  socket.on("answer", ({ answer, roomId, toSocketId }) => {
    console.log(`Sending answer from ${socket.id} to ${toSocketId} in room ${roomId}`)

    // Send directly to the recipient socket
    io.to(toSocketId).emit("answer", answer)
  })

  socket.on("ice_candidate", ({ candidate, roomId, toSocketId }) => {
    console.log(`Sending ICE candidate from ${socket.id} to ${toSocketId}`)
    io.to(toSocketId).emit("ice_candidate", candidate)
  })

  socket.on("send_message", ({ roomId, message, fromUserId, fromUserRole }) => {
    console.log(`Message in room ${roomId} from ${fromUserRole} ${fromUserId}`)

    io.in(roomId).emit("receive_message", {
      message,
      fromUserId,
      fromUserRole,
      timestamp: new Date().toISOString(),
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    // Clean up user from activeUsers
    for (const [userId, data] of activeUsers.entries()) {
      if (data.socketId === socket.id) {
        activeUsers.delete(userId)
        break
      }
    }

    // Clean up user from all rooms
    for (const [roomId, participants] of roomParticipants.entries()) {
      for (const [participantId, data] of participants.entries()) {
        if (data.socketId === socket.id) {
          participants.delete(participantId)

          // Notify others in the room
          socket.to(roomId).emit("user_left", {
            userId: participantId,
            userRole: data.userRole,
          })

          // Remove empty rooms
          if (participants.size === 0) {
            roomParticipants.delete(roomId)
          }
          break
        }
      }
    }
  })
})


const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
