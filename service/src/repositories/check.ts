import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Check } from '../entities/check';

@injectable()
export class CheckRepository {

    private static checks: Check[] = [];

    public async insert(check: Check): Promise<void> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        await collection.insertOne(check);
    }

    public async findAll(url: string): Promise<Check[]> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        const result: any[] = await collection.find({
            url,
        }).toArray();

        return result.map((x: any) => new Check(x.id, x.responseTime, x.timestamp, x.up, x.url));
    }

}
