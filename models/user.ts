import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  activePlan: string[];
  subscription?: mongoose.Types.ObjectId; // Optional reference to Subscription
}

const userSchema = new mongoose.Schema<IUser>({
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
  activePlan: {
    type: [String], // Define as an array of strings
    enum: ["free", "premium", "pro"], // Use enum for predefined values
    default: ["free"], // Set a default value
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: false, // Make it optional if not always needed
  },
});

// Ensure to check if the model already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
