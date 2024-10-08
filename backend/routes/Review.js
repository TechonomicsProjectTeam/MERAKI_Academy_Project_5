const express = require("express");
const reviewRouter = express.Router();
const {
  createNewReview,
  getReviewByProductId,
  updateReview,
  deleteReview,
  getAllReviews 
} = require("../controllers/Review");

const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

reviewRouter.post(
  "/:id",
  authentication,
  authorization("CREATE_REVIEW"),
  createNewReview
);
reviewRouter.get("/:id", getReviewByProductId);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.get("/", getAllReviews);

module.exports = reviewRouter;
