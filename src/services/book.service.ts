import { FilterQuery } from "mongoose";
import { IBook, BookModel } from "../models";

class BooksService {
  public async getBooks(): Promise<IBook[]> {
    return await BookModel.find();
  }
  public async getBook(query: FilterQuery<IBook>): Promise<IBook> {
    return await BookModel.findOne(query);
  }

  public async createBook(book: IBook): Promise<IBook> {
    return await BookModel.create(book);
  }

  public async updateBook(id: string, book: IBook): Promise<IBook> {
    const toUpdate = { ...book };
    return await BookModel.findOneAndUpdate({ _id: id }, toUpdate);
  }

  public async deleteBook(_id: string): Promise<IBook> {
    return await BookModel.findByIdAndDelete(_id);
  }
}

export const booksService = new BooksService();