import fs from 'fs';
import path from 'path';
import util from 'util';

class LogFile {
  public enabled: boolean = false;
  public fname: string = path.join(process.cwd(), 'dxscanner.log');
  private file: fs.WriteStream | null = null;

  /**
   * Writes the given value to the log file.
   * @param {*} obj The value to write
   * @memberof LogFile
   */
  public write(obj: any) {
    if (!this.enabled) return;
    if (this.file === null) this.file = fs.createWriteStream(this.fname);
    this.file.write(typeof(obj) === 'string' ? obj : this.format(obj));
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

  /**
   * Flushes and closes the log file
   * Nothing can be added to the log after calling this method.
   * @memberof LogFile
   */
  public close() {
    this.file?.close();
  }

  private format(obj: any): string {
    return util.format(obj);
  }
}

const logfile = new LogFile();

// TODO: fix closing the stream on process exit
process.on('beforeExit', logfile.close);

export default logfile;
