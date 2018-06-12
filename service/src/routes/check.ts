import * as express from 'express';
import { Check } from '../entities/check';
import { ICheckService } from '../interfaces/check-service';
import { container } from '../ioc';

export class CheckRouter {

    public static async get(req: express.Request, res: express.Response) {
        if (!req['user']) {
            res.status(401).end();
        }

        try {
            const checkService: ICheckService = container.get<ICheckService>('ICheckService');

            const result: Check[] = await checkService.list(req.query.url, req['user'].id);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    }

}
