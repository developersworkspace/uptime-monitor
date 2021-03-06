import { inject, injectable } from 'inversify';
import { Check } from '../entities/check';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { IWebsiteService } from '../interfaces/website-service';
import { WebsiteStatistics } from '../value-objects/website-statistics';

@injectable()
export class WebsiteService implements IWebsiteService {

    constructor(
        @inject('ICheckRepository')
        protected checkRepository: ICheckRepository,
        @inject('IWebsiteRepository')
        protected websiteRepository: IWebsiteRepository,
    ) {

    }

    public async create(userId: string, website: Website): Promise<Website> {
        if (!userId) {
            return null;
        }

        if (!website.valid()) {
            return null;
        }

        const existingWebsite: Website = await this.websiteRepository.find(website.url, userId);

        if (existingWebsite) {
            return existingWebsite;
        }

        const id: string = await this.websiteRepository.insert(userId, website);

        website.id = id;

        return website;
    }

    public async delete(url: string, userId: string): Promise<Website> {
        if (!userId) {
            return null;
        }

        const website: Website = await this.websiteRepository.find(url, userId);

        if (!website) {
            return null;
        }

        await this.websiteRepository.delete(website.id, userId);

        return website;
    }

    public async find(url: string, userId: string): Promise<Website> {
        return this.websiteRepository.find(url, userId);
    }

    public async list(userId: string): Promise<Website[]> {
        return this.websiteRepository.findAll(userId);
    }

    public async statistics(currentTimestamp: Date, url: string, userId: string): Promise<WebsiteStatistics> {
        const website: Website = await this.websiteRepository.find(url, userId);

        if (!website) {
            return null;
        }

        const checks: Check[] = await this.checkRepository.findAll(url);

        if (checks.length !== 0) {
            website.createdTimestamp = checks[0].timestamp;
        }

        const totalDownTimeInMilliseconds: number = this.calculateTotalDownTimeInMilliseconds(checks, website);

        const availability: number = this.availabilitySince(currentTimestamp, website.createdTimestamp, totalDownTimeInMilliseconds);

        const averageResponseTime: number = await this.checkRepository.calculateAverageResponseTime(url);

        return new WebsiteStatistics(availability, averageResponseTime, totalDownTimeInMilliseconds, website);
    }

    protected availabilitySince(currentTimestamp: Date, startTimestamp: Date, downTimeInMiliseconds: number): number {
        const millisecondsElapsedSinceStartTimestamp: number = currentTimestamp.getTime() - startTimestamp.getTime();

        return (millisecondsElapsedSinceStartTimestamp - downTimeInMiliseconds) / millisecondsElapsedSinceStartTimestamp * 100;
    }

    protected calculateTotalDownTimeInMilliseconds(checks: Check[], website: Website): number {
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

        return totalDownTimeInMilliseconds;
    }

}
