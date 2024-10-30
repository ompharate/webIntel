import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  maxLimit: {
    type: Number,
    required: true,
    default: 10,
  },
  currentLimit: {
    type: Number,
    required: true,
    default: 10,
    min: 0,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;