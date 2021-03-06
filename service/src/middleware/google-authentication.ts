import axios from 'axios';
import * as express from 'express';

export class GoogleAuthenticationMiddleware {

    public static async handle(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const accessToken: string = request.get('authorization');

            if (!accessToken) {
                next();
                return;
            }

            const userInfoResponse: any = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
            if (userInfoResponse.status !== 200) {
                next();
                return;
            }

            request['user'] = userInfoResponse.data;

            next();

        } catch {
            next();
        }
    }

}
