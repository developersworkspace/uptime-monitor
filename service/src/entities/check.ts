export class Check {

    constructor(
        public id: string,
        public responseTime: number,
        public timestamp: Date,
        public up: boolean,
        public url: string,
    ) {

    }

    public static create(endTimestamp: Date, startTimestamp: Date, url: string): Check {
        if (!endTimestamp && !startTimestamp) {
            return new Check(null, null, new Date(), false, url);
        }

        return new Check(null, endTimestamp.getTime() - startTimestamp.getTime(), new Date(), true, url);
    }

}
