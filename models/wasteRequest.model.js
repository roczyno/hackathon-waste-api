import mongoose from "mongoose";

const WasteRequestSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    numberOfBins: {
      type: String,
      required: true,
    },
    serviceOption: {
      type: String,
      required: true,
    },
    wasteType: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("wasteRequest", WasteRequestSchema);
