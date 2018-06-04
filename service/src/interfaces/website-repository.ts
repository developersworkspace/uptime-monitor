import { Website } from '../entities/website';

export interface IWebsiteRepository {

    find(url: string, userId: string): Promise<Website>;

    findAll(userId: string): Promise<Website[]>;

    insert(userId: string, website: Website): Promise<void>;

}
