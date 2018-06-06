import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Website } from '../entities/website';
import { ICheckRepository } from '../interfaces/check-repository';
import { IMonitorService } from '../interfaces/monitor-service';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { MonitorService } from './monitor';

describe('MonitorService', () => {

  let checkRepository: ICheckRepository = null;
  let websiteRepository: IWebsiteRepository = null;

  beforeEach(async () => {
    checkRepository = {
      calculateAverageResponseTime: null,
      findAll: null,
      findLast: async () => {
        return null;
      },
      insert: async () => {
        return null;
      },
    } as ICheckRepository;

    websiteRepository = {
      find: null,
      findAll: async () => {
        return null;
      },
      insert: null,
    } as IWebsiteRepository;
  });

  describe('#checkAll', () => {
    it('should check all website availability', async () => {
      const checkRepositoryInsertSpy: sinon.SinonSpy = sinon.spy(checkRepository, 'insert');

      sinon.stub(websiteRepository, 'findAll').returns([
        new Website(null, null, null, 'http://example.com'),
        new Website(null, null, null, 'http://example.com'),
      ]);

      const monitorSerivce: IMonitorService = new MonitorService(checkRepository, websiteRepository);

      await monitorSerivce.checkAll();

      expect(checkRepositoryInsertSpy.callCount).to.be.eq(2);
    });
  });

});
