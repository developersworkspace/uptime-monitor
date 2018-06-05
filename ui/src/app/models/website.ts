import * as timeAgo from 'time-ago';
import * as moment from 'moment';

export class Website {

    public createdTimestampBadge: string = null;

    public createdTimestampDisplay: string = null;

    constructor(
        public createdTimestamp: Date,
        public id: string,
        public name: string,
        public url: string,
    ) {
        this.setCreatedTimestampDisplay();

        this.setCreatedTimestampBadge();
    }

    protected setCreatedTimestampBadge(): void {
        // tslint:disable-next-line:max-line-length
        this.createdTimestampBadge = `https://img.shields.io/badge/${encodeURI(`Since-${this.createdTimestampDisplay}-lightgray`)}.svg`;
    }

    protected setCreatedTimestampDisplay(): void {
        this.createdTimestampDisplay = `${moment(this.createdTimestamp).format('DD MMM YYYY')} (${timeAgo.ago(this.createdTimestamp)})`;
    }

}
