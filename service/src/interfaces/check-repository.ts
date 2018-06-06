import { Check } from '../entities/check';

export interface ICheckRepository {

    calculateAverageResponseTime(url: string): Promise<number>;

    findAll(url: string): Promise<Check[]>;

    findLast(url: string): Promise<Check>;

    insert(check: Check): Promise<string>;

}
