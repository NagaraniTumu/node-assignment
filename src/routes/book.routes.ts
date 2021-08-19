import { Router } from "express";
import { createValidator } from "express-joi-validation";

import { bookController, reviewController } from "../controllers";

import {
  bookReqParamsSchema,
  bookPostReqSchema,
  bookUpdateReqSchema,
  reviewReqParamsSchema,
  reviewPostReqSchema,
  reviewUpdateReqSchema,
} from "../models";

const router = Router();
const validator = createValidator({ passError: true });

router.get("", bookController.getBooks);

router.post("", validator.body(bookPostReqSchema), bookController.createBook);

router.get(
  "/:book_id",
  validator.params(bookReqParamsSchema),
  bookController.getBookById
);

router.put(
  "/:book_id",
  validator.params(bookReqParamsSchema),
  validator.body(bookUpdateReqSchema),
  bookController.updateBook
);

router.delete(
  "/:book_id",
  validator.params(bookReqParamsSchema),
  bookController.deleteBook
);

// Reviews routes
router.get(
  "/:book_id/reviews",
  validator.params(bookReqParamsSchema),
  reviewController.getReviews
);
router.post(
  "/:book_id/reviews",
  validator.params(bookReqParamsSchema),
  validator.body(reviewPostReqSchema),
  reviewController.createReviews
);

router.get(
  "/:book_id/reviews/:review_id",
  validator.params(reviewReqParamsSchema),
  reviewController.getReview
);

router.put(
  "/:book_id/reviews/:review_id",
  validator.params(reviewReqParamsSchema),
  validator.body(reviewUpdateReqSchema),
  reviewController.updateReview
);

router.delete(
  "/:book_id/reviews/:review_id",
  validator.params(reviewReqParamsSchema),
  reviewController.deleteReview
);

export default router;
