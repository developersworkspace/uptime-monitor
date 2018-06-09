import { Container } from 'inversify';
import 'reflect-metadata';
import { ICheckRepository } from './interfaces/check-repository';
import { ICheckService } from './interfaces/check-service';
import { IMonitorService } from './interfaces/monitor-service';
import { IWebsiteRepository } from './interfaces/website-repository';
import { IWebsiteService } from './interfaces/website-service';
import { CheckRepository } from './repositories/check';
import { WebsiteRepository } from './repositories/website';
import { CheckService } from './services/check';
import { MonitorService } from './services/monitor';
import { WebsiteService } from './services/website';

const container: Container = new Container();

container.bind<ICheckRepository>('ICheckRepository').to(CheckRepository);
container.bind<ICheckService>('ICheckService').to(CheckService);
container.bind<IMonitorService>('IMonitorService').to(MonitorService);
container.bind<IWebsiteRepository>('IWebsiteRepository').to(WebsiteRepository);
container.bind<IWebsiteService>('IWebsiteService').to(WebsiteService);

export {
    container,
};
