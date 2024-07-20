const express = require("express");
const reviewRouter = express.Router();
const {
  createNewReview,
  getReviewByProductId,
  updateReview,
  deleteReview,
} = require("../controllers/Review");

reviewRouter.post("/", createNewReview);
reviewRouter.get("/:id", getReviewByProductId);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);

module.exports = reviewRouter;
