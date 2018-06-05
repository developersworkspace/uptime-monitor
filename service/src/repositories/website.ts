import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Website } from '../entities/website';
import { IWebsiteRepository } from '../interfaces/website-repository';

@injectable()
export class WebsiteRepository implements IWebsiteRepository {

    public async find(url: string, userId: string): Promise<Website> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('websites');

        const result: any = await collection.findOne({
            url,
            userId,
        });

        if (!result) {
            return null;
        }

        return new Website(result.createdTimestamp, result.id, result.name, result.url);
    }

    public async findAll(userId: string): Promise<Website[]> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('websites');

        const result: any[] = await collection.find({
            userId,
        }).toArray();

        return result.map((x: any) => new Website(x.createdTimestamp, x.id, x.name, x.url));
    }

    public async insert(userId: string, website: Website): Promise<void> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('websites');

        await collection.insertOne(website);
    }

}
