import { Check } from '../entities/check';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { WebsiteStatistics } from '../value-objects/website-statistics';

export class StatisticsService {

    constructor(
        protected checkRepository: ICheckRepository,
        protected websiteRepository: IWebsiteRepository,
    ) {

    }

    public async websiteStatistics(url: string, userId: string): Promise<WebsiteStatistics> {
        const website: Website = await this.websiteRepository.find(url, userId);

        const checks: Check[] = await this.checkRepository.findAll(url);

        let totalDownTimeInMilliseconds: number = 0;

        let up: boolean = checks.length === 0 ? false : checks[0].up;

        let downCheckTimestamp: Date = checks.length === 0 ? website.createdTimestamp : (checks[0].up ? null : checks[0].timestamp);

        for (let index = 1; index < checks.length; index++) {
            const check: Check = checks[index];

            if (up && !check.up) {
                downCheckTimestamp = check.timestamp;
                up = check.up;
            } else if (up && check.up) {

            } else if (!up && !check.up) {

            } else if (!up && check.up) {
                totalDownTimeInMilliseconds += check.timestamp.getTime() - downCheckTimestamp.getTime();
                up = check.up;
            }
        }

        const availability: number = this.availabilitySince(website.createdTimestamp, totalDownTimeInMilliseconds);

        return new WebsiteStatistics(availability, website);
    }

    protected availabilitySince(startTimestamp: Date, downTimeInMiliseconds: number): number {
        const millisecondsElapsedSinceStartTimestamp: number = new Date().getTime() - startTimestamp.getTime();

        return (millisecondsElapsedSinceStartTimestamp - downTimeInMiliseconds) / millisecondsElapsedSinceStartTimestamp * 100;
    }

}
