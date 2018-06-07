import { injectable } from 'inversify';
import * as mongodb from 'mongodb';
import { Check } from '../entities/check';
import { ICheckRepository } from '../interfaces/check-repository';
import { BaseRepository } from './base';

@injectable()
export class CheckRepository extends BaseRepository implements ICheckRepository {

    public async calculateAverageResponseTime(url: string): Promise<number> {
        const database: mongodb.Db = await this.getDatabase();

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

    public async findAll(url: string): Promise<Check[]> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('checks');

        const result: any[] = await collection.find({
            url,
        }).sort({
            timestamp: 1,
        }).toArray();

        return result.map((x: any) => new Check(x.error, x._id, x.responseTime, x.timestamp, x.up, x.url));
    }

    public async findLast(url: string): Promise<Check> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('checks');

        const result: any[] = await collection.find({
            url,
        }).sort({
            timestamp: -1,
        }).toArray();

        if (result.length === 0) {
            return null;
        }

        return new Check(result[0].error, result[0]._id, result[0].responseTime, result[0].timestamp, result[0].up, result[0].url);
    }

    public async insert(check: Check): Promise<string> {
        const database: mongodb.Db = await this.getDatabase();

        const collection: mongodb.Collection = database.collection('checks');

        const dto: any = {
            error: check.error,
            responseTime: check.responseTime,
            timestamp: check.timestamp,
            up: check.up,
            url: check.url,
        };

        await collection.insertOne(dto);

        return dto._id;
    }

}
