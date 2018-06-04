import { IStatisticsService } from './interfaces/statistics-service';
import { CheckRepository } from './repositories/check';
import { WebsiteRepository } from './repositories/website';
import { StatisticsService } from './services/statistics';
import { WebsiteStatistics } from './value-objects/website-statistics';

(async () => {

    const statisticsService: IStatisticsService = new StatisticsService(new CheckRepository(), new WebsiteRepository());

    const websiteStatistics: WebsiteStatistics = await statisticsService.websiteStatistics('https://euromonitor.com', null);

    console.log(websiteStatistics);
})();
