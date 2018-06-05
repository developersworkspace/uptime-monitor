import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Check } from '../entities/check';
import { ICheckRepository } from '../interfaces/check-repository';

@injectable()
export class CheckRepository implements ICheckRepository {

    public async calculateAverageResponseTime(url: string): Promise<number> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        const result: any[] = await collection.aggregate([
            {
                $match: {
                    url,
                },
            },
            {
                $group: {
                    _id: 'all',
                    average: {
                        $avg: '$responseTime',
                    },
                },
            },
        ]).toArray();

        return result.length === 0 ? null : result[0].average;
    }

    public async insert(check: Check): Promise<string> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        const lastCheck: Check = await this.findLast(check.url);

        let stateChanged: boolean = true;

        if (lastCheck && check.up === lastCheck.up) {
            stateChanged = false;
        }

        const dto: any = {
            responseTime: check.responseTime,
            stateChanged,
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
            stateChanged: true,
            url,
        }).toArray();

        return result.map((x: any) => new Check(x._id, x.responseTime, x.timestamp, x.up, x.url));
    }

    protected async findLast(url: string): Promise<Check> {
        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        const database: mongodb.Db = client.db('uptime-monitor');

        const collection: mongodb.Collection = database.collection('checks');

        const result: any[] = await collection.find({
            url,
        }).sort({
            timestamp: -1,
        }).toArray();

        if (result.length === 0) {
            return null;
        }

        return new Check(result[0]._id, result[0].responseTime, result[0].timestamp, result[0].up, result[0].url);
    }

}
