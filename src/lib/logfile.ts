import os from 'os';
import fs from 'fs';
import path from 'path';
import util from 'util';

class LogFile {
  public enabled: boolean = false;
  public fname: string = path.join(process.cwd(), 'dxscanner.log');
  private file: number | null = null;

  /**
   * Writes the given value to the log file.
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public write(obj: any) {
    if (!this.enabled) return;

    if (this.file === null) {
      this.file = fs.openSync(this.fname, 'w');

      process.on('exit', () => {
        if (typeof this.file === 'number') {
          fs.writeSync(this.file, '<End of log>' + os.EOL);
          fs.closeSync(this.file);
        }
      });
    }

    fs.write(this.file, typeof obj === 'string' ? obj : this.format(obj), () => {});
  }

  /**
   * Writes the given value to the log file, followed by a newline.
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public log(obj: any) {
    this.write(this.format(obj) + '\n');
  }

  /**
   * Writes the given value to the log file, each line prepended with [error].
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public error(obj: any) {
    this.write('[error] ' + this.format(obj) + '\n');
  }

  /**
   * Writes the given value to the log file, each line prepended with [warn].
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public warn(obj: any) {
    this.write('[warn] ' + this.format(obj) + '\n');
  }

  /**
   * Writes the given value to the log file, each line prepended with [info].
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public info(obj: any) {
    this.write('[info] ' + this.format(obj) + '\n');
  }

  private format(obj: any): string {
    return util.format(obj);
  }
}

const logfile = new LogFile();

export default logfile;
