/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import util from 'util';
import { logfile } from '../lib/logfile'

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
    logfile.log('[info] ▶', message, ...params);
  }
  warning(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.warn('⚠️', message, ...params);
    logfile.log('[warn] ⚠', message, ...params);
  }
  error(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.error('🛑', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
    logfile.log('[error] 🛑', message, ...params);
  }
  completed(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log('✅', message, ...params);
    // tslint:disable-next-line
    console.info('-----------------------');
    logfile.log('[info] ✅', message, ...params);
  }
  info(message?: any, ...params: any[]): any {
    // tslint:disable-next-line
    console.log(message, ...params);
    logfile.log('[info]', message, ...params);
  }
}
