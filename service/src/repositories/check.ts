import { injectable } from 'inversify';
import { Check } from '../entities/check';

@injectable()
export class CheckRepository {

    private static checks: Check[] = [];

    public async insert(check: Check): Promise<void> {
        CheckRepository.checks.push(check);
    }

    public async findAll(url: string): Promise<Check[]> {
        return CheckRepository.checks.filter((check: Check) => check.url === url);
    }

}
