import { WebsiteStatistics } from '../value-objects/website-statistics';

export interface IStatisticsService {

    websiteStatistics(url: string, userId: string): Promise<WebsiteStatistics>;

}
