import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true},
  codename: { type: String, required: true},
  dateofbirth: { type: Date },
  location: { type: String },
  firstname: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 60 * 60 * 48 // 48 hours
  
  },
});

const User = mongoose.model("User", userSchema);

export default User;