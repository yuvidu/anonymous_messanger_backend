import mongoose from "mongoose";
import { setTimeout } from "timers/promises";

console.log("mongodb connection is starting")

export const connectDB = async (attempt = 25 , delay = 4000) => {
    for(let i=0; i<attempt; i++){
        console.log("connection attempt",i+1)
        try {
            console.log("connection attempt",i+1)
            const conn = await mongoose.connect(process.env.MONGODB_URI,{
                serverSelectionTimeoutMS: 5000, // Timeout after 5s per attempt
                connectTimeoutMS: 10000, // Timeout for initial connection
            })
            console.log(`mongodb is connected ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.log("connection attempt",i+1,"failed")
            console.log("error connecting to mongodb",error)
            if(i<attempt-1){
                await setTimeout(delay);
            }
            else{
                console.log("all connection attempts failed")
            }
        }
    }
}

