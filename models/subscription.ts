import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  planType: {
    type: String,
    required: true,
  },
  status: {
    type: ["active", "inactive"],
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
});

const Subscription =
  mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
export default Subscription;