import { Website } from '../entities/website';
import { IWebsiteRepository } from '../interfaces/website-repository';

export class WebsiteRepository implements IWebsiteRepository {

    private static websites: Website[] = [
        new Website(new Date(), '1', 'Euromonitor', 'https://euromonitor.com'),
    ];

    public async find(url: string, userId: string): Promise<Website> {
        return WebsiteRepository.websites.find((website: Website) => website.url === url);
    }

    public async findAll(userId: string): Promise<Website[]> {
        return WebsiteRepository.websites;
    }

    public async insert(userId: string, website: Website): Promise<void> {
        WebsiteRepository.websites.push(website);
    }

}
