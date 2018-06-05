import { Check } from '../entities/check';

export interface ICheckRepository {

    findAll(url: string): Promise<Check[]>;

    insert(check: Check): Promise<string>;

}
