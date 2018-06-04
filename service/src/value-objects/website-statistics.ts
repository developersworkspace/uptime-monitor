import { Website } from '../entities/website';

export class WebsiteStatistics {

    constructor(
        public availability: number,
        public website: Website,
    ) {

    }

}
