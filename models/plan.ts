import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
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
  mongoose.models.Plan || mongoose.model("Plan", planSchema);
  console.log(Plans)
export default Plans;
