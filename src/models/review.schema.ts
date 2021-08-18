import * as mongoose from "mongoose";
import { IReview } from "./book.interface";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: String, required: true },
    message: { type: String, required: true },
  },
  { versionKey: false }
);

reviewSchema.set("toJSON", {
  transform: (doc, result) => {
    result.review_id = result._id;
    delete result._id;
  },
});
export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);
