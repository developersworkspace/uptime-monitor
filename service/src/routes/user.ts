import * as express from 'express';

export class UserRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            res.json(req['user']);
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    }

}
