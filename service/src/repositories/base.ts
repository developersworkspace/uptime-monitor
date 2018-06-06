import { injectable } from 'inversify';
import * as mongodb from 'mongodb';

@injectable()
export class BaseRepository {

    private static database: mongodb.Db = null;

    protected async getDatabase(): Promise<mongodb.Db> {
        if (BaseRepository.database) {
            return BaseRepository.database;
        }

        const client: mongodb.MongoClient = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');

        BaseRepository.database = client.db('uptime-monitor');

        return this.getDatabase();
    }

}
