import Message from "../models/message.model.js";


{/*export const sendMessage = async (req,res) => {
    const {message,senderid,roomid} = req.body;
    const {receiverid} = req.params;

    if(!message || !senderid || !receiverid){
        res.status(400).json({message:"all fields are required"})
        console.log("Missing fields:", {message, senderid, receiverid});
        return;
    }
    try {
        const newmessage = new Message({
            message,
            senderid,
            receiverid,
            roomid
        })
        await newmessage.save();
        res.status(201).json({message:"message sent"
            , newmessage
        })
        return;
        
    } catch (error) {
        console.log("Error while sending message:", error);
        res.status(500).json({message:"internal server error"})  
        return;   
    }
}  */}

export const getMessages = async (req,res) => {
    const usercookie = req.cookies.userdata;
    if(usercookie){
        const user = typeof usercookie === 'string' ? JSON.parse(usercookie) : usercookie;
        const userid = user.id;
        const senderid = userid;
        const {receiverid} = req.params;
        if(!receiverid){
            res.status(400).json({message:"receiver id is required"})
            return;
        }
        const messages = await Message.find({
        senderid:{ $in: [senderid, receiverid]},
        receiverid:{ $in: [receiverid, senderid]}
        })
        res.status(200).json({messages})
        return;
    }
    else{
        res.status(401).json({message:"unauthorized when fetching messages"})
        return;
    }  
}
export const getMessages2 = async (req,res) => {
    const {receiverId,senderId,roomId} = req.query;
    if(!receiverId || !senderId || !roomId){
        res.status(400).json({message:"all fields are required"})
        return;
    }
    const messages = await Message.find({
        senderid:{ $in: [senderId, receiverId]},
        receiverid:{ $in: [receiverId, senderId]}
    })

    res.status(200).json({messages})    
    return;
}

