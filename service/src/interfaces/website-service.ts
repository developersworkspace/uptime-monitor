import { Website } from '../entities/website';
import { WebsiteStatistics } from '../value-objects/website-statistics';

export interface IWebsiteService {

    create(userId: string, website: Website): Promise<Website>;

    delete(url: string, userId: string): Promise<Website>;

    find(url: string, userId: string): Promise<Website>;

    list(userId: string): Promise<Website[]>;

    statistics(currentTimestamp: Date, url: string, userId: string): Promise<WebsiteStatistics>;
}
