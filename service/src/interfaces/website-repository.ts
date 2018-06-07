import { Website } from '../entities/website';

export interface IWebsiteRepository {

    delete(id: string, userId: string): Promise<void>;

    find(url: string, userId: string): Promise<Website>;

    findAll(userId: string): Promise<Website[]>;

    insert(userId: string, website: Website): Promise<string>;

}
