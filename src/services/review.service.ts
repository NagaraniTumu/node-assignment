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
}

export default new ReviewsService();
