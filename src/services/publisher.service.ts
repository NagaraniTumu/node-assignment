import { IPublisher, PublisherModel } from "../models";

class PublisherService {
  public async getPublishers(query = {}): Promise<IPublisher[]> {
    return await PublisherModel.find(query);
  }

  public async getPublisher(publisherId: string, options = {}): Promise<IPublisher> {
    return await PublisherModel.findOne({ _id: publisherId }, options);
  }

  public async createPublisher(publisher: IPublisher): Promise<IPublisher> {
    return await PublisherModel.create(publisher);
  }

  public async updatePublisher(publisher: IPublisher): Promise<IPublisher> {
    return await PublisherModel.findOneAndUpdate(
      { _id: publisher._id },
      publisher
    );
  }
}

export const publisherService = new PublisherService();