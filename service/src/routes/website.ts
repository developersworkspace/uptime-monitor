import * as express from 'express';
import { Website } from '../entities/website';
import { IWebsiteService } from '../interfaces/website-service';
import { container } from '../ioc';
import { WebsiteStatistics } from '../value-objects/website-statistics';

export class WebsiteRouter {

    public static async get(req: express.Request, res: express.Response) {
        try {
            const websiteService: IWebsiteService = container.get<IWebsiteService>('IWebsiteService');

            if (req.query.url) {
                const result: Website = await websiteService.find(req.query.url, null);

                res.json(result);
            } else {
                const result: Website[] = await websiteService.list(null);

                res.json(result);
            }
        } catch (err) {
            res.status(500).end();
        }
    }

    public static async post(req: express.Request, res: express.Response) {
        try {
            const body = req.body;

            console.log(body);

            const website: Website = new Website(new Date(), body.id, body.name, body.url);

            const websiteService: IWebsiteService = container.get<IWebsiteService>('IWebsiteService');

            const result: Website = await websiteService.create(null, website);

            res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    }

    public static async statistics(req: express.Request, res: express.Response) {
        try {
            const websiteService: IWebsiteService = container.get<IWebsiteService>('IWebsiteService');

            const result: WebsiteStatistics = await websiteService.statistics(new Date(), req.query.url, null);

            res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    }

}
