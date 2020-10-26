/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import util from 'util';
import logfile from './logfile';

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
    logfile.info('task start: ' + util.format(message) + params.map(util.format).join(' '));
  }
  warning(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.warn('⚠️', message, ...params);
    logfile.warn(util.format(message) + params.map(util.format).join(' '));
  }
  error(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.error('🛑', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
    logfile.error(util.format(message) + params.map(util.format).join(' '));
  }
  completed(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log('✅', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
    logfile.info('completed: ' + util.format(message) + params.map(util.format).join(' '));
  }
  info(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log(message, ...params);
    logfile.info(util.format(message) + params.map(util.format).join(' '));
  }
}
