export interface IReview {
  _id: string;
  reviewer: string;
  message: string;
}

export interface IPublisher {
  _id: string;
  name: string;
  location: string;
}

export interface IBook {
  _id: string;
  name: string;
  author: string[];
  price: string;
  reviews: string[];
  publisher: string;
}
