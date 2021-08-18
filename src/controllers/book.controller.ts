import { Request, Response, NextFunction } from "express";

import { booksService, reviewsService, publisherService } from "../services";

import { handler } from "../handlers";

import { STATUS_CODES } from "../constants/app.constants";
import { ERROR_MSGS, SUCCESS_MSGS } from "../constants/message.constants";

class BookController {
  public async getBookById(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;

    await booksService
      .getBook({ _id: bookId })
      .then(async (book) => {
        if (book) {
          const results = await configureBooks([book]);

          handler.send(req, res, SUCCESS_MSGS.BooksById, results[0]);
        } else {
          handler.sendError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${bookId}`,
            next
          );
        }
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async getBooks(req: Request, res: Response, next: NextFunction) {
    await booksService
      .getBooks()
      .then(async (books) => {
        const results = await configureBooks(books);

        handler.send(req, res, SUCCESS_MSGS.Books, results);
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async createBook(req: Request, res: Response, next: NextFunction) {
    const newBook = { ...req.body };

    const book = await booksService.getBook({ name: newBook.name });
    if (book) {
      return handler.sendError(
        STATUS_CODES.Conflict,
        `${ERROR_MSGS.BookExists} ${book.name}`,
        next
      );
    }

    if (newBook.reviews) {
      const reviews = await reviewsService.createReviews(newBook.reviews);
      newBook.reviews = reviews.map((review) => review._id);
    }

    const publisher = await publisherService.createPublisher(newBook.publisher);
    newBook.publisher = publisher._id;

    await booksService
      .createBook(newBook)
      .then((doc) => {
        handler.send(req, res, SUCCESS_MSGS.CreateBook, doc);
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async updateBook(req: Request, res: Response, next: NextFunction) {
    const book = { ...req.body };
    const bookId = req.params.book_id;

    if (book.publisher) {
      const publisher = await publisherService.updatePublisher(
        req.body.publisher
      );
      if (!publisher) {
        handler.sendError(
          STATUS_CODES.NotFound,
          `${ERROR_MSGS.InvalidPublisherId} ${book.publisher._id}`,
          next
        );
      }
    }

    await booksService
      .updateBook(bookId, book)
      .then((doc) => {
        if (!doc) {
          handler.sendError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${book._id}`,
            next
          );
        } else {
          handler.send(req, res, SUCCESS_MSGS.UpdateBook);
        }
      })
      .catch((err) => {
        if ((err.name = "MongoDBError") && err.code === 11000) {
          handler.sendError(
            STATUS_CODES.Conflict,
            `${ERROR_MSGS.BookExists} #${book.name}`,
            next
          );
        } else handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }

  public async deleteBook(req: Request, res: Response, next: NextFunction) {
    const bookId = req.params.book_id;

    await booksService
      .deleteBook(bookId)
      .then((data) => {
        if (!data) {
          handler.sendError(
            STATUS_CODES.NotFound,
            `${ERROR_MSGS.InvalidBookId} ${bookId}`,
            next
          );
        } else {
          handler.send(req, res, SUCCESS_MSGS.DeleteBook, {});
        }
      })
      .catch((err) => {
        handler.sendError(STATUS_CODES.InternalServerError, err, next);
      });
  }
}

const configureBooks = async (books) => {
  return await Promise.all(
    books.map(async (book) => {
      const reviews = await reviewsService.getReviews({
        _id: { $in: book.reviews },
      });

      const publisher = await publisherService.getPublisher(book.publisher);

      book.reviews = reviews;
      book.publisher = publisher;

      return book;
    })
  );
};
export const bookController = new BookController();
