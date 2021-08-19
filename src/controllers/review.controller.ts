import { Request, Response, NextFunction } from "express";

import { booksService, reviewsService } from "../services";

import { handler } from "../handlers";

import { STATUS_CODES } from "../constants/app.constants";
import { ERROR_MSGS, SUCCESS_MSGS } from "../constants/message.constants";

class ReviewController {
  public async getReviews(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;

    const book = await booksService.getBook({ _id: bookId });
    if (!book) {
      return handler.sendError(
        STATUS_CODES.NotFound,
        `${ERROR_MSGS.InvalidBookId} ${bookId}`,
        next
      );
    }

    await reviewsService
      .getReviews({ _id: { $in: book.reviews } })
      .then((reviews) => {
        handler.send(req, res, SUCCESS_MSGS.Reviews, reviews);
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async getReview(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;

    const book = await booksService.getBook({ _id: bookId });
    if (!book) {
      return handler.sendError(
        STATUS_CODES.NotFound,
        `${ERROR_MSGS.InvalidBookId} ${bookId}`,
        next
      );
    }

    const reviewIdExists = book.reviews.includes(reviewId.toString());
    if (!reviewIdExists) {
      return handler.sendError(
        STATUS_CODES.NotFound,
        `${ERROR_MSGS.InvalidReviewId} ${reviewId}`,
        next
      );
    }

    await reviewsService
      .getReview(reviewId)
      .then((review) => {
        handler.send(req, res, SUCCESS_MSGS.ReviewsById, review);
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async createReviews(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;
    try {
      const book = await booksService.getBook({ _id: bookId });
      if (!book) {
        return handler.sendError(
          STATUS_CODES.NotFound,
          `${ERROR_MSGS.InvalidBookId} ${bookId}`,
          next
        );
      }

      const reviews = await reviewsService.createReviews(req.body);
      if (reviews) {
        book.reviews = [
          ...book.reviews,
          ...reviews.map((review) => review._id),
        ];
        await booksService.updateBook(bookId, book);

        handler.send(req, res, SUCCESS_MSGS.CreateReviews, reviews);
      }
    } catch (err) {
      handler.sendError(STATUS_CODES.InternalServerError, err, next);
    }
  }

  public async updateReview(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;

    const book = await booksService.getBook({ _id: bookId });
    if (!book) {
      return handler.sendError(
        STATUS_CODES.NotFound,
        `${ERROR_MSGS.InvalidBookId} ${bookId}`,
        next
      );
    }

    const reviewIdExists = book.reviews.includes(reviewId.toString());
    if (!reviewIdExists) {
      return handler.sendError(
        STATUS_CODES.NotFound,
        `${ERROR_MSGS.InvalidReviewId} ${reviewId}`,
        next
      );
    }

    await reviewsService
      .updateReview(reviewId, req.body)
      .then(() => {
        handler.send(req, res, SUCCESS_MSGS.UpdateReview);
      })
      .catch((err) => {
        return handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async deleteReview(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;
    try {
      const book = await booksService.getBook({ _id: bookId });
      if (!book) {
        return handler.sendError(
          STATUS_CODES.NotFound,
          `${ERROR_MSGS.InvalidBookId} ${bookId}`,
          next
        );
      }

      const reviewIdExists = book.reviews.includes(reviewId.toString());
      if (!reviewIdExists) {
        return handler.sendError(
          STATUS_CODES.NotFound,
          `${ERROR_MSGS.InvalidReviewId} ${reviewId}`,
          next
        );
      }

      const index = book.reviews.indexOf(reviewId, 0);
      if (index > -1) {
        book.reviews.splice(index, 1);
      }

      await booksService.updateBook(bookId, book);

      await reviewsService.deleteReview(reviewId).then(() => {
        handler.send(req, res, SUCCESS_MSGS.DeleteReview, {});
      });
    } catch (err) {
      return handler.sendError(STATUS_CODES.InternalServerError, err, next);
    }
  }
}

export const reviewController = new ReviewController();
