import * as mongoose from "mongoose";
import { IPublisher } from "./book.interface";

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
  },
  { versionKey: false }
);

publisherSchema.set("toJSON", {
  transform: (doc, result) => {
    result.publisher_id = result._id;
    delete result._id;
  },
});
export const PublisherModel = mongoose.model<IPublisher>(
  "Publisher",
  publisherSchema
);
