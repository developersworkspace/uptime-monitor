import * as express from 'express';

export class UserRouter {

    public static async get(req: express.Request, res: express.Response) {
        if (!req['user']) {
            res.status(401).end();
        }

        try {
            res.json(req['user'] ? req['user'] : null);
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    }

}
