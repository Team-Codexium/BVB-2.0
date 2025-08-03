import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: false
    }
  });
  
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Join battle room
    socket.on("join-battle", (battleId) => {
      socket.join(`battle-${battleId}`);
      console.log(`Client ${socket.id} joined battle room: battle-${battleId}`);
    });
    
    // Leave battle room
    socket.on("leave-battle", (battleId) => {
      socket.leave(`battle-${battleId}`);
      console.log(`Client ${socket.id} left battle room: battle-${battleId}`);
    });
    
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  return io;
}

export function getio() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

// Helper function to emit vote updates to specific battle room
export function emitVoteUpdate(battleId, voteData) {
  if (!io) throw new Error("Socket.IO not initialized");
  io.to(`battle-${battleId}`).emit("vote-update", voteData);
  console.log(`Vote update emitted to battle-${battleId}:`, voteData);
}

