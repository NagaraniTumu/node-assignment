import { IReview, ReviewModel } from "../models";

class ReviewsService {
  public async getReviews(query = {}, options = {}): Promise<IReview[]> {
    return await ReviewModel.find(query, options);
  }

  public async getReview(reviewId: string): Promise<IReview> {
    return await ReviewModel.findOne({ _id: reviewId });
  }

  public async createReviews(reviews: IReview[]): Promise<IReview[]> {
    return await ReviewModel.insertMany(reviews);
  }

  public async updateReview(id: string, review: IReview): Promise<IReview> {
    const toUpdate = { ...review };
    return await ReviewModel.findOneAndUpdate({ _id: id }, toUpdate);
  }

  public async deleteReview(id: string): Promise<IReview> {
    return await ReviewModel.findOneAndDelete({ _id: id });
  }
}

export const reviewsService = new ReviewsService();