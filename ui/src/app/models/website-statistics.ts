import { Website } from './website';

export class WebsiteStatistics {

    constructor(
        public availability: number,
        public averageResponseTime: number,
        public website: Website,
    ) {

    }

}
