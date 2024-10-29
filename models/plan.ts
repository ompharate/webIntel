import { Description } from "@radix-ui/react-dialog";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  maxLimit: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Plans =
  mongoose.models.Plan || mongoose.model("Plan", subscriptionSchema);
export default Plans;
