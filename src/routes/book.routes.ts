import { Application } from "express";
import { createValidator } from "express-joi-validation";

import BookController from "../controllers/book.controller";
import {
  reqHeaderSchema,
  bookReqParamsSchema,
  bookPostReqSchema,
  bookUpdateReqSchema,
} from "../middleware/validation.middleware";

import LoggingHandler from "../handlers/logging.handler";

class BookRoutes {
  public validator = createValidator({ passError: true });

  public route(app: Application) {
    app.use((req, res, next) => {
      LoggingHandler.log(req);
      next();
    });

    app.get(
      "/books",
      this.validator.headers(reqHeaderSchema),
      BookController.getBooks
    );

    app.get(
      "/books/:book_id",
      this.validator.headers(reqHeaderSchema),
      this.validator.params(bookReqParamsSchema),
      BookController.getBookById
    );

    app.post(
      "/books",
      this.validator.headers(reqHeaderSchema),
      this.validator.body(bookPostReqSchema),
      BookController.createBook
    );

    app.put(
      "/books/:book_id",
      this.validator.headers(reqHeaderSchema),
      this.validator.params(bookReqParamsSchema),
      this.validator.body(bookUpdateReqSchema),
      BookController.updateBook
    );

    app.delete(
      "/books/:book_id",
      this.validator.headers(reqHeaderSchema),
      this.validator.params(bookReqParamsSchema),
      BookController.deleteBook
    );
  }
}

export default new BookRoutes();
