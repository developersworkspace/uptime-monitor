import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as schedule from 'node-schedule';
import * as path from 'path';
import * as swagger from 'swagger-ui-express';
import * as yamljs from 'yamljs';
import * as yargs from 'yargs';
import { IMonitorService } from './interfaces/monitor-service';
import { container } from './ioc';
import { GoogleAuthenticationMiddleware } from './middleware/google-authentication';
import { CheckRouter } from './routes/check';
import { UserRouter } from './routes/user';
import { WebsiteRouter } from './routes/website';

const argv = yargs.argv;
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

const swaggerDocument = yamljs.load(path.join(__dirname, 'swagger.yaml'));

app.use('/api/docs', swagger.serve, swagger.setup(swaggerDocument, { explore: true }));

app.use(GoogleAuthenticationMiddleware.handle);

app.route('/api/check')
    .get(CheckRouter.get);

app.route('/api/user')
    .get(UserRouter.get);

app.route('/api/website')
    .delete(WebsiteRouter.delete)
    .get(WebsiteRouter.get)
    .post(WebsiteRouter.post);

app.route('/api/website/statistics')
    .get(WebsiteRouter.statistics);

app.listen(argv.port || process.env.PORT || 3000, () => {
    // logger.info(`listening on port ${argv.port || process.env.PORT || 3000}`);
});

schedule.scheduleJob('*/1 * * * *', () => {
    const monitorService: IMonitorService = container.get<IMonitorService>('IMonitorService');

    monitorService.checkAll();
});
