import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true},
  senderid: { type: String, required: true},
  receiverid: { type: String ,required: true},
  roomid: { type: String ,required: true},

  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 60 * 60 * 2400 // 2400 hours
  
  },
},{timestamps:true});

const Message = mongoose.model("Message", messageSchema);

export default Message;