import { Website } from '../entities/website';

export class WebsiteStatistics {

    constructor(
        public availability: number,
        public averageResponseTime: number,
        public totalDownTimeInMilliseconds: number,
        public website: Website,
    ) {

    }

}
