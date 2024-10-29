import mongoose from "mongoose";

const connection = {
  isConnected: false,
};

async function connectToDb() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.NEXT_MONGODB_URI as string);

  connection.isConnected = db.connection.readyState === 1;
}

export default connectToDb;