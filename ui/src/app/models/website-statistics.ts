import { Website } from './website';

export class WebsiteStatistics {

    public availabilityBadge: string = null;

    public averageResponseTimeBadge: string = null;

    constructor(
        public availability: number,
        public averageResponseTime: number,
        public website: Website,
    ) {
        this.setAvailabilityBadge();

        this.setAverageResponseTimeBadge();
    }

    protected setAvailabilityBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.availabilityBadge = `https://img.shields.io/badge/${encodeURI(`Availability-${this.availability} %-${this.getAvailabilityBadgeColor()}`)}.svg`;
    }

    protected setAverageResponseTimeBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.averageResponseTimeBadge = `https://img.shields.io/badge/${encodeURI(`Average Response Time-${Math.round(this.averageResponseTime)} ms-green`)}.svg`;
    }

    protected getAvailabilityBadgeColor(): string {
        if (this.availability > 99.999) {
            return 'green';
        }

        if (this.availability > 98) {
            return 'yellow';
        }

        if (this.availability > 95) {
            return 'orange';
        }

        return 'red';
    }

}
