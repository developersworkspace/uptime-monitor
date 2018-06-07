import { Website } from './website';

export class WebsiteStatistics {

    public availabilityBadge: string = null;

    public averageResponseTimeBadge: string = null;

    public totalDownTimeInMillisecondsBadge: string = null;

    constructor(
        public availability: number,
        public averageResponseTime: number,
        public totalDownTimeInMilliseconds: number,
        public website: Website,
    ) {
        this.setAvailabilityBadge();

        this.setAverageResponseTimeBadge();

        this.setTotalDownTimeInMillisecondsBadge();
    }

    protected setAvailabilityBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.availabilityBadge = `https://img.shields.io/badge/${encodeURI(`Availability-${Math.round(this.availability * 10000) / 10000} %-${this.getAvailabilityBadgeColor()}`)}.svg`;
    }

    protected setAverageResponseTimeBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.averageResponseTimeBadge = `https://img.shields.io/badge/${encodeURI(`Average Response Time-${Math.round(this.averageResponseTime)} ms-green`)}.svg`;
    }

    protected setTotalDownTimeInMillisecondsBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.totalDownTimeInMillisecondsBadge = `https://img.shields.io/badge/${encodeURI(`Total Down Time-${Math.round(this.totalDownTimeInMilliseconds / 1000)} seconds-red`)}.svg`;
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
