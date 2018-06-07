export class Check {

    constructor(
        public error: any,
        public id: string,
        public responseTime: number,
        public timestamp: Date,
        public up: boolean,
        public url: string,
    ) {

    }

    public static create(endTimestamp: Date, error: any, startTimestamp: Date, url: string): Check {
        if (error || (!endTimestamp && !startTimestamp)) {
            return new Check(error, null, null, new Date(), false, url);
        }

        return new Check(error, null, endTimestamp.getTime() - startTimestamp.getTime(), new Date(), true, url);
    }

}
