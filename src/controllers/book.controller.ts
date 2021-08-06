import { Request, Response, NextFunction } from "express";

import BooksService from "../services/book.service";
import ReviewsService from "../services/review.service";
import PublisherService from "../services/publisher.service";

import HttpException from "../handlers/http.handler";

import LoggingHandler from "../handlers/logging.handler";

import { IBook } from "models";

import { STATUS_CODES } from "../constants/app.constants";
import { ERROR_MSGS, SUCCESS_MSGS } from "../constants/message.constants";

class BookController {
  public async getBookById(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;

    await BooksService.getBook({ _id: bookId })
      .then(async (book) => {
        if (book) {
          const results = await configureBooks([book]);

          handleResponse(req, res, SUCCESS_MSGS.BooksById, results[0]);
        } else {
          handleError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${bookId}`,
            next
          );
        }
      })
      .catch((err) => {
        handleError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async getBooks(req: Request, res: Response, next: NextFunction) {
    await BooksService.getBooks()
      .then(async (books) => {
        const results = await configureBooks(books);

        handleResponse(req, res, SUCCESS_MSGS.Books, results);
      })
      .catch((err) => {
        handleError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async createBook(req: Request, res: Response, next: NextFunction) {
    const newBook = { ...req.body };

    const book = await BooksService.getBook({ name: newBook.name });
    if (book) {
      return handleError(
        STATUS_CODES.Conflict,
        `${ERROR_MSGS.BookExists} ${book.name}`,
        next
      );
    }

    if (newBook.reviews) {
      const reviews = await ReviewsService.createReviews(newBook.reviews);
      newBook.reviews = reviews.map((review) => review._id);
    }

    const publisher = await PublisherService.createPublisher(newBook.publisher);
    newBook.publisher = publisher._id;

    await BooksService.createBook(newBook)
      .then((doc) => {
        handleResponse(req, res, SUCCESS_MSGS.CreateBook, doc);
      })
      .catch((err) => {
        handleError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async updateBook(req: Request, res: Response, next: NextFunction) {
    const book = { ...req.body };
    const bookId = req.params.book_id;

    if (book.publisher) {
      const publisher = await PublisherService.updatePublisher(
        req.body.publisher
      );
      if (!publisher) {
        handleError(
          STATUS_CODES.NotFound,
          `${ERROR_MSGS.InvalidPublisherId} ${book.publisher._id}`,
          next
        );
      }
    }

    await BooksService.updateBook(bookId, book)
      .then((doc) => {
        if (!doc) {
          handleError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${book._id}`,
            next
          );
        } else {
          handleResponse(req, res, SUCCESS_MSGS.UpdateBook, doc);
        }
      })
      .catch((err) => {
        if ((err.name = "MongoDBError") && err.code === 11000) {
          handleError(
            STATUS_CODES.Conflict,
            `${ERROR_MSGS.BookExists} #${book.name}`,
            next
          );
        } else handleError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async deleteBook(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;

    await BooksService.deleteBook(bookId)
      .then((data) => {
        if (!data) {
          handleError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${bookId}`,
            next
          );
        } else {
          handleResponse(req, res, SUCCESS_MSGS.DeleteBook, {});
        }
      })
      .catch((err) => {
        handleError(STATUS_CODES.InternalServerError, err, next);
      });
  }
}

const configureBooks = async (books) => {
  return await Promise.all(
    books.map(async (book) => {
      const reviews = await ReviewsService.getReviews({
        _id: { $in: book.reviews },
      });

      const publisher = await PublisherService.getPublisher(book.publisher);

      book.reviews = reviews;
      book.publisher = publisher;

      return book;
    })
  );
};

const handleError = (status: number, message: string, next: NextFunction) => {
  return next(new HttpException(status, message));
};

const handleResponse = (
  req: Request,
  res: Response,
  message: string,
  data?: any | IBook
) => {
  LoggingHandler.logSuccess(req.url, message, data);
  res.send({
    statusCode: STATUS_CODES.Success,
    message: message,
    data: data,
  });
};

export default new BookController();
