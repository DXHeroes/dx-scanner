import { args } from 'commander';
import _debug from 'debug';
import util from 'util';
import logfile from './logfile';

export default function debug(namespace: string): _debug.Debugger {
  const debugf = _debug(namespace);

  function _dbger(formatters: any, ...args: any[]): void {
    if (logfile.enabled)
      logfile.log(
        util
          .format(formatters, ...args)
          .split('\n')
          .map((line: string) => `[${namespace}] ${line}`)
          .join('\n'),
      );
    debugf(formatters, ...args);
  }

  _dbger.color = debugf.color;
  _dbger.enabled = debugf.enabled;
  _dbger.log = debugf.log;
  _dbger.namespace = debugf.namespace;
  _dbger.destroy = debugf.destroy;
  _dbger.extend = debugf.extend;

  const dbger: _debug.Debugger = _dbger;

  return dbger;
}
