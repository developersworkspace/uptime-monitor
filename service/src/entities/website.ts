export class Website {

    constructor(
        public createdTimestamp: Date,
        public id: string,
        public name: string,
        public url: string,
    ) {

    }

    public valid(): boolean {
        if (!this.name || !this.url) {
            return false;
        }

        return true;
    }

}
