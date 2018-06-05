import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Check } from '../entities/check';
import { ICheckRepository } from '../interfaces/check-repository';

@injectable()
export class CheckRepository implements ICheckRepository {

    private static checks: Check[] = [];

    public async insert(check: Check): Promise<string> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        const dto: any = {
            responseTime: check.responseTime,
            timestamp: check.timestamp,
            up: check.up,
            url: check.url,
        };

        await collection.insertOne(dto);

        return dto._id;
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
