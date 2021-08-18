import * as mongoose from "mongoose";

import { IBook } from "./book.interface";

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    author: [{ type: String, required: true }],
    price: { type: String, required: true },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    publisher: {
      type: Schema.Types.ObjectId,
      ref: "Publisher",
    },
  },
  { versionKey: false }
);

export const BookModel = mongoose.model<IBook>("Book", bookSchema);
