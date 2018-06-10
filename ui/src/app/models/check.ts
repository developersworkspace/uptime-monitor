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

}
