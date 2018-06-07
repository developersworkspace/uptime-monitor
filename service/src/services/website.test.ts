import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Check } from '../entities/check';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { IWebsiteService } from '../interfaces/website-service';
import { WebsiteStatistics } from '../value-objects/website-statistics';
import { WebsiteService } from './website';

describe('WebsiteService', () => {

    let checkRepository: ICheckRepository = null;
    let websiteRepository: IWebsiteRepository = null;

    beforeEach(async () => {
        checkRepository = {
            calculateAverageResponseTime: async () => {
             return null;
            },
            findAll: async () => {
                return null;
            },
            findLast: null,
            insert: null,
        } as ICheckRepository;

        websiteRepository = {
            delete: null,
            find: async () => {
                return null;
            },
            findAll: null,
            insert: null,
        } as IWebsiteRepository;
    });

    describe('#statistics', () => {

        it('should return website statistics with availability', async () => {
            sinon.stub(checkRepository, 'findAll')
                .returns([
                    new Check(null, null, null, new Date(2018, 0, 1, 0, 0, 0), true, null),
                    new Check(null, null, null, new Date(2018, 0, 2, 0, 0, 0), true, null),
                    new Check(null, null, null, new Date(2018, 0, 3, 0, 0, 0), false, null),
                    new Check(null, null, null, new Date(2018, 0, 4, 0, 0, 0), true, null),
                ]);

            sinon.stub(websiteRepository, 'find')
                .returns(new Website(new Date(2018, 0, 1, 0, 0, 0), null, null, null));

            const websiteService: IWebsiteService = new WebsiteService(checkRepository, websiteRepository);

            const result: WebsiteStatistics = await websiteService.statistics(new Date(2018, 0, 5, 0, 0, 0), null, null);

            expect(result).to.be.not.null;
            expect(result.availability).to.be.eq(75);
        });

        it('should return website statistics with total down time in milliseconds', async () => {
            sinon.stub(checkRepository, 'findAll')
                .returns([
                    new Check(null, null, null, new Date(2018, 0, 1, 0, 0, 0), true, null),
                    new Check(null, null, null, new Date(2018, 0, 2, 0, 0, 0), true, null),
                    new Check(null, null, null, new Date(2018, 0, 3, 0, 0, 0), false, null),
                    new Check(null, null, null, new Date(2018, 0, 4, 0, 0, 0), true, null),
                ]);

            sinon.stub(websiteRepository, 'find')
                .returns(new Website(new Date(2018, 0, 1, 0, 0, 0), null, null, null));

            const websiteService: IWebsiteService = new WebsiteService(checkRepository, websiteRepository);

            const result: WebsiteStatistics = await websiteService.statistics(new Date(2018, 0, 5, 0, 0, 0), null, null);

            expect(result).to.be.not.null;
            expect(result.totalDownTimeInMilliseconds).to.be.eq(86400000);
        });

        it('should return null given non-existing url', async () => {
            const websiteService: IWebsiteService = new WebsiteService(checkRepository, websiteRepository);

            const result: WebsiteStatistics = await websiteService.statistics(null, null, null);

            expect(result).to.be.null;
        });

    });

});
