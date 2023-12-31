import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(401, "No user found!"));
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getUsers = async (req, res, next) => {
  const query = req.query.new;
  const search = req.query.search;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(10)
      : search
      ? await Waste.find({
          username: { $regex: search, $options: "i" },
        })
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
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
  } catch (error) {
    res.status(500).json(error);
  }
};

export const countUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      res.status(200).json({ message: "No users found!" });
    } else {
      res.status(200).json(userCount);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
    console.log(error);
  }
};
