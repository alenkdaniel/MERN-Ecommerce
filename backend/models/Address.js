import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  phone: String,
  address: String,
  city: String,
});

const Address = mongoose.model("Address", addressSchema);
export default Address