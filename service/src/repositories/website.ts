import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Website } from '../entities/website';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { BaseRepository } from './base';

@injectable()
export class WebsiteRepository extends BaseRepository implements IWebsiteRepository {

    public async delete(id: string, userId: string): Promise<void> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('websites');

        await collection.deleteOne({
            _id: id,
            userId,
        });
    }

    public async find(url: string, userId: string): Promise<Website> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('websites');

        const result: any = await collection.findOne({
            url,
            userId,
        });

        if (!result) {
            return null;
        }

        return new Website(result.createdTimestamp, result._id, result.name, result.url);
    }

    public async findAll(userId: string): Promise<Website[]> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('websites');

        const result: any[] = await collection.find({
            userId,
        }).sort({
            createdTimestamp: -1,
        }).toArray();

        return result.map((x: any) => new Website(x.createdTimestamp, x._id, x.name, x.url));
    }

    public async insert(userId: string, website: Website): Promise<string> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('websites');

        const dto: any = {
            createdTimestamp: website.createdTimestamp,
            name: website.name,
            url: website.url,
            userId,
        };

        await collection.insertOne(dto);

        return dto._id;
    }

}
