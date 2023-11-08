import Waste from "../models/wasteRequest.model.js";
import createError from "../utils/createError.js";

export const createWasteRequest = async (req, res) => {
  try {
    const wasteRequest = new Waste(req.body);
    const savedWasteRequest = await wasteRequest.save();
    res.status(201).send({ message: "Request sent successfully, Thank You" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWasteRequest = async (req, res) => {
  try {
    const updatedWasteRequest = await Waste.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).send({ message: "Update successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};
export const getAllWasteRequest = async (req, res) => {
  const query = req.query.new;
  const search = req.query.search;
  try {
    const wasteRequests = query
      ? await Waste.find().sort({ _id: -1 }).limit(10)
      : search
      ? await Waste.find({
          username: { $regex: search, $options: "i" },
        })
      : await Waste.find();
    res.status(200).json(wasteRequests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteWasteRequest = async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export const latestRequest= async (req, res) => {
  try {
    const latestRequest = await Waste.findOne().sort({ createdAt: -1 });
    if (!latestRequest) {
      return res.status(404).json({ message: 'No latest request found' });
    }
    res.status(200).json(latestRequest);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const changeStatus = async (req, res, next) => {
  try {
    const request = await Waste.findById(req.params.id);
    request.status = "Waste Collected";
    if (!request) next(createError(200, "Not found"));

    await request.save();
    res.status(200).send({ message: "Update successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const countRequest = async (req, res) => {
  try {
    const requestCount = await Waste.countDocuments();
    if (requestCount === 0) {
      res.status(200).json({ message: "No user found" });
    } else {
      res.status(200).json(requestCount);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWasteRequestStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await Waste.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
