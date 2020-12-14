
import debug from 'debug';
import fs from 'fs';
import path from 'path';
import util from 'util';

class Logfile {
  public enabled: boolean = false;
  public fname: string = path.join(process.cwd(), `dxscanner${Date.now()}.log`);
  private file: number | null = null;

  /**
   * Writes the given string to the log file.
   * @param {*} content The string to write
   * @memberof LogFile
   */
  public write(content: string) {
    if (!this.enabled) return;

    if (this.file === null) {
      this.file = fs.openSync(this.fname, 'w');

      process.on('exit', () => {
        if (typeof this.file === 'number') {
          fs.closeSync(this.file);
        }
      });
    }

    fs.write(this.file, content, () => {});
  }

  /**
   * Writes the given value to the log file, followed by a newline.
   * @param {*} args The values to write
   * @memberof LogFile
   */
  public log(format: any, ...args: any[]) {
    this.write(util.format(format, ...args) + '\n');
  }
}

/**
 * The Logfile instance, contains methods for writing to the logfile directly
 */
export const logfile = new Logfile();

/**
 * Enables the logfile methods and
 * intercepts calls to `debug` to also write to `dxscanner.log`
 */
export function enableLogfile(): void {
  logfile.enabled = true;

  const removeANSIPattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
  ].join('|');
  const removeANSIRe = new RegExp(removeANSIPattern, 'g');
  const removeANSI = (s: string): string => s.replace(removeANSIRe, '');

  debug.log = function(...args: any[]) {
    const formatted = util.format(args[0], ...args.slice(1)) + '\n';
    logfile.write(removeANSI(formatted));
    process.stderr.write(formatted);
  }
}
