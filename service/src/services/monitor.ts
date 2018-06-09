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

        const checkedWebsites: {} = {};

        for (const website of websites) {
            if (website.url in checkedWebsites) {
                continue;
            }

            const check: Check = await this.checkWithRetry(website.url);

            const previousCheck: Check = await this.checkRepository.findLast(website.url);

            if (previousCheck && check.up === previousCheck.up) {
                continue;
            }

            await this.checkRepository.insert(check);

            checkedWebsites[website.url] = check;
        }
    }

    protected async check(url: string): Promise<Check> {
        try {
            const startTimestamp: Date = new Date();

            const response: any = await axios.get(url, {
                // timeout: 400,
            });

            const endTimestamp: Date = new Date();

            if (response.status !== 200) {
                return Check.create(null, {
                    status: response.status,
                }, null, url);
            }

            return Check.create(endTimestamp, null, startTimestamp, url);
        } catch (error) {
            console.log(url);
            return Check.create(null, {
                message: error.message,
            }, null, url);
        }
    }

    protected async checkWithRetry(url: string): Promise<Check> {
        let check: Check = null;

        for (let count = 0; count < 4; count ++) {
            check = await this.check(url);

            if (check.up) {
                break;
            }

            await this.delay(500);
        }

        return check;
    }

    protected delay(milliseconds: number): Promise<void> {
        return new Promise((resolve: () => void, reject: (error: Error) => void) => {
            setTimeout(resolve, milliseconds);
        });
    }

}
