import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  DateOfBirth: { type: Date, required: true },
  Member_Number: { type: Number, required: true },
  Interests: { type: String, required: true },
});

const Customer =
  mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
