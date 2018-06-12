import { inject, injectable } from 'inversify';
import { Check } from '../entities/check';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { ICheckService } from '../interfaces/check-service';
import { IWebsiteRepository } from '../interfaces/website-repository';

@injectable()
export class CheckService implements ICheckService {

    constructor(
        @inject('ICheckRepository')
        protected checkRepository: ICheckRepository,
        @inject('IWebsiteRepository')
        protected websiteRepository: IWebsiteRepository,
    ) {

    }

    public async list(url: string, userId: string): Promise<Check[]> {
        if (!userId) {
            return null;
        }

        const website: Website = await this.websiteRepository.find(url, userId);

        if (!website) {
            return null;
        }

        return this.checkRepository.findAll(url);
    }

}
