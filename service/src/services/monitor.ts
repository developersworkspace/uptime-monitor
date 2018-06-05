import axios from 'axios';
import { inject, injectable } from 'inversify';
import { Check } from '../entities/check';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { IMonitorService } from '../interfaces/monitor-service';
import { IWebsiteRepository } from '../interfaces/website-repository';

@injectable()
export class MonitorService implements IMonitorService {

    constructor(
        @inject('ICheckRepository')
        protected checkRepository: ICheckRepository,
        @inject('IWebsiteRepository')
        protected websiteRepository: IWebsiteRepository,
    ) {

    }

    public async checkAll(): Promise<void> {
        const websites: Website[] = await this.websiteRepository.findAll(null);

        for (const website of websites) {
            const check: Check = await this.check(website.url);

            await this.checkRepository.insert(check);
        }
    }

    protected async check(url: string): Promise<Check> {
        try {
            const startTimestamp: Date = new Date();
            const response: any = await axios.get(url);
            const endTimestamp: Date = new Date();

            return Check.create(endTimestamp, startTimestamp, url);
        } catch {
            return Check.create(null, null, url);
        }
    }

}
