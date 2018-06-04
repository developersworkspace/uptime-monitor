import { expect } from 'chai';
import 'mocha';
import { IMonitorService } from '../interfaces/monitor-service';
import { MonitorService } from './monitor';
import { ICheckRepository } from '../interfaces/check-repository';
import { CheckRepository } from '../repositories/check';
import { IWebsiteRepository } from '../interfaces/website-repository';
import { WebsiteRepository } from '../repositories/website';

describe('MonitorService', () => {

  describe('#checkAll', () => {
    it('should check all website availability', async () => {
      const checkRepository: ICheckRepository = new CheckRepository();
      const websiteRepository: IWebsiteRepository = new WebsiteRepository();

      const monitorSerivce: IMonitorService = new MonitorService(checkRepository, websiteRepository);
    
      await monitorSerivce.checkAll();
    
      // TODO: Assert on SPY
    });
  });

});