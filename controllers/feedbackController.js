const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

// POST /api/feedback
exports.createFeedback = async (req, res, next) => {
  try {
    const { studentName, courseName, message, rating } = req.body;

    const missing = [];
    if (!studentName) missing.push("studentName");
    if (!courseName) missing.push("courseName");
    if (!message) missing.push("message");
    if (rating === undefined || rating === null || rating === "") missing.push("rating");
    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missing.join(", ")}`,
      });
    }

    const numRating = Number(rating);
    if (Number.isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res
        .status(400)
        .json({ success: false, error: "rating must be a number between 1 and 5" });
    }

    const feedback = await Feedback.create({
      studentName,
      courseName,
      message,
      rating: numRating,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback?page=1&limit=5
exports.getFeedback = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ success: false, error: "page and limit must be positive integers" });
    }

    const skip = (page - 1) * limit;

    const [feedbacks, totalRecords] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      currentPage: page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: feedbacks,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/feedback/:id
exports.updateFeedbackStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid feedback ID" });
    }
    if (!status) {
      return res.status(400).json({ success: false, error: "status is required" });
    }
    if (!["Pending", "Reviewed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "status must be either 'Pending' or 'Reviewed'" });
    }

    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
