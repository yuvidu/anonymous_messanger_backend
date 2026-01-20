import { connectDB } from "./db/connection.js";
import dotenv from "dotenv";
import express from "express";
import userRoute from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.route.js";
import http from "http";
import {Server} from "socket.io";
import Message from "./models/message.model.js";


dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);


const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173","https://anonymous-yuvidu-frontend.netlify.app"], // your frontend URL
        methods: ["GET","POST"],
        credentials: true
    }
})
const onlineUsers = new Map(); // userId => socketId
let queue = []; // waiting users in queue for pairing


io.on("connection",(socket)=>{

    console.log('User connected: ', socket.id);
    socket.emit("welcome","to socket server backend")

    socket.on("user-online",(userId)=>{
        onlineUsers.set(userId, socket.id);
        console.log("Online users:", Array.from(onlineUsers.entries()));
        io.emit("online-users",Array.from(onlineUsers.keys()))
    })
    socket.emit("online-users",Array.from(onlineUsers.keys()))


    // handling user joining the matchmaking queue

    socket.on("joinqueue", (userId) => {
        if (queue.find(user => user.userId === userId)) {
            return; // User is already in the queue
        }
        queue.push({userId, socketid: socket.id});
        if (queue.length >= 2) {
            //shifting out two users from the queue and assign then 2 variables
            const user1 = queue.shift();
            const user2 = queue.shift();

            // prevent self-match
            if (user1.userId === user2.userId) {
                console.log("⚠️ Skipped self-match");
                return;
            }

            const roomId = `room-${user1.userId}-${user2.userId}`;

            io.to(user1.socketid).emit("matched",{partnerId: user2.userId, roomId});
            io.to(user2.socketid).emit("matched",{partnerId: user1.userId, roomId});

            console.log(`Matched users ${user1.userId} and ${user2.userId} in room ${roomId}`);

            io.sockets.sockets.get(user1.socketid)?.join(roomId);
            io.sockets.sockets.get(user2.socketid)?.join(roomId);     
   
        }
    })

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });

    socket.on("send-message", async ({ roomId, message, senderid, receiverid }) => {

        const newmessage = new Message({
            message,
            senderid,
            receiverid,
            roomid: roomId
        })
        await newmessage.save();
        io.to(roomId).emit("newmessage", {
            message,
            senderid,
            receiverid,
            roomid: roomId,
            createdAt: newmessage.createdAt,
            _id: newmessage._id
        })
        return;
    })











    socket.on("disconnect",()=>{
        queue = queue.filter(u => u.socketId !== socket.id);

        for (let [userId,sId] of onlineUsers.entries()){
            if(sId === socket.id){
                onlineUsers.delete(userId);
            }
        }
        io.emit("online-users",Array.from(onlineUsers.keys()))
        console.log("User disconnected", socket.id);
    })



    socket.on("offline-users",(userId) =>{
        onlineUsers.delete(userId);
        io.emit("online-users",Array.from(onlineUsers.keys()))
    })
})






app.use(cors({ 
    origin: "http://localhost:5173", // your frontend URL
    credentials: true}
));

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        message:"Server is running",
        status:"success",
        version:"1.0.0",
        Timestamp: new Date().toISOString()
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
