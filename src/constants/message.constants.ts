export const ERROR_MSGS = {
  Unauthorized: "Missing or invalid token",
  BadRequest: "Missing required request headers or parameters",
  InternalServerError: "Server encountered an unexpected condition",
  MongoDBError: "MongoDBError",
  MissingReqRequestHeaders: "Missing required request headers",
  MissingReqRequestParams: "Missing required request parameters",
  InvalidPublisherId: "Invalid pupblisher id",
  InvalidReviewId: "Invalid review id",
  InvalidBookId: "Invalid book id",
  BookExists: "Book name already exists in the database",
};

export const SUCCESS_MSGS = {
  Books: "Successfully returned a list of books",
  BooksById: "Successfully returned a book",
  CreateBook: "Successfully created a new book",
  UpdateBook: "Successfully updated a book",
  DeleteBook: "Successfully deleted a book",
};
