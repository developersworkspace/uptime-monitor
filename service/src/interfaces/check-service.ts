import { Check } from '../entities/check';

export interface ICheckService {

    list(url: string, userId: string): Promise<Check[]>;

}
