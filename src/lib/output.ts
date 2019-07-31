/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';

export interface IOutput {
  info(message?: any, ...params: any[]): void;
  warning(message?: any, ...params: any[]): void;
  error(message?: any, ...params: any[]): void;
  taskStart(message?: any, ...params: any[]): void;
  completed(message?: any, ...params: any[]): void;
}

@injectable()
export class ConsoleOutput implements IOutput {
  taskStart(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.info('');
    // tslint:disable-next-line
    console.info('-----------------------');
    // tslint:disable-next-line
    console.info('▶️', message, ...params);
  }
  warning(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.warn('⚠️', message, ...params);
  }
  error(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.error('🛑', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
  }
  completed(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log('✅', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
  }
  info(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log(message, ...params);
  }
}
