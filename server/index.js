import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pino from "pino";
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

const logger = pino();
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
  logger.info("New connection:", socket.id);

  socket.on("register_user", ({ userId, userRole }) => {
    logger.info(
      `Registering user: ${userId} (${userRole}) with socket: ${socket.id}`
    );
    activeUsers.set(userId, { socketId: socket.id, userRole });
  });

  socket.on("join_appointment_room", ({ appointmentId, userId, userRole }) => {
    const roomId = `appointment-${appointmentId}`;
    logger.info(`${userRole} ${userId} joining room: ${roomId}`);

    socket.join(roomId);

    if (!roomParticipants.has(roomId)) {
      roomParticipants.set(roomId, new Map());
    }

    const uniqueUserId = `${userRole}-${userId}`;
    roomParticipants.get(roomId).set(uniqueUserId, {
      socketId: socket.id,
      userRole,
      userId,
    });

    logger.info(
      "Room participants:",
      Array.from(roomParticipants.get(roomId).entries())
    );

    const participants = Array.from(roomParticipants.get(roomId).entries()).map(
      ([id, data]) => ({
        userId: id,
        userRole: data.userRole,
        socketId: data.socketId,
      })
    );

    io.to(roomId).emit("room_participants", participants);
  });

  socket.on("initiate_call", ({ appointmentId, fromUserId, fromUserRole }) => {
    const roomId = `appointment-${appointmentId}`;
    logger.info(
      `${fromUserRole} ${fromUserId} initiating call in room: ${roomId}`
    );

    socket.to(roomId).emit("call_initiated", {
      fromUserId,
      fromUserRole,
      appointmentId,
    });
  });

  socket.on("offer", ({ offer, roomId, toSocketId }) => {
    logger.info(
      `Sending offer from ${socket.id} to ${toSocketId} in room ${roomId}`
    );

    io.to(toSocketId).emit("offer", {
      offer,
      from: socket.id,
    });
  });

  socket.on("answer", ({ answer, roomId, toSocketId }) => {
    logger.info(
      `Sending answer from ${socket.id} to ${toSocketId} in room ${roomId}`
    );

    io.to(toSocketId).emit("answer", answer);
  });

  socket.on("ice_candidate", ({ candidate, roomId, toSocketId }) => {
    logger.info(`Sending ICE candidate from ${socket.id} to ${toSocketId}`);
    io.to(toSocketId).emit("ice_candidate", candidate);
  });

  socket.on("send_message", ({ roomId, message, fromUserId, fromUserRole }) => {
    logger.info(`Message in room ${roomId} from ${fromUserRole} ${fromUserId}`);

    io.in(roomId).emit("receive_message", {
      message,
      fromUserId,
      fromUserRole,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("leave_call", ({ roomId, userId, userRole }) => {
    logger.info(`User leaving call: ${userRole} ${userId} from room ${roomId}`);

    activeUsers.delete(userId);

    if (roomParticipants.has(roomId)) {
      const participants = roomParticipants.get(roomId);
      const uniqueUserId = `${userRole}-${userId}`;

      if (participants.has(uniqueUserId)) {
        participants.delete(uniqueUserId);

        socket.to(roomId).emit("user_left", {
          userId: uniqueUserId,
          userRole: userRole,
        });

        if (participants.size === 0) {
          roomParticipants.delete(roomId);
        }
      }
    }

    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.id);

    for (const [userId, data] of activeUsers.entries()) {
      if (data.socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
    for (const [roomId, participants] of roomParticipants.entries()) {
      for (const [participantId, data] of participants.entries()) {
        if (data.socketId === socket.id) {
          participants.delete(participantId);
          socket.to(roomId).emit("user_left", {
            userId: participantId,
            userRole: data.userRole,
          });

          if (participants.size === 0) {
            roomParticipants.delete(roomId);
          }
          break;
        }
      }
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
