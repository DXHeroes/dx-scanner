/* eslint-disable no-process-env */
import 'reflect-metadata';
import * as commander from 'commander';
import Run from './commands/run';
import { PracticeImpact } from './model';
import Init from './commands/init';
import Practices from './commands/practices';
import _ from 'lodash';
import updateNotifier from 'update-notifier';
import { errorHandler } from './lib/errors';
import logfile from './lib/logfile';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../package.json');

class DXScannerCommand {
  static async run(): Promise<void> {
    const cmder = new commander.Command();

    // default cmd config
    cmder
      .version(pjson.version)
      .name('dx-scanner')
      .usage('[command] [options] ')
      .option('-l --log', 'Write an execution log to ./dxscanner.log', this.enableLogfile)
      .on('--help', () => {
        console.log('');
        console.log('Aliases:');
        console.log('  dxs');
        console.log('  dxscanner');
      });

    // cmd: run
    cmder
      .command('run [path]')
      //customize default help
      .usage('[path] [options]')
      .description('Scan your project for possible DX recommendations')
      .option(
        '-a --authorization <authorization>',
        'credentials to the repository (in format "token" or "username:token"; can be set as ENV variable DXSCANNER_GIT_SERVICE_TOKEN)',
        process.env.DXSCANNER_GIT_SERVICE_TOKEN || process.env.GITHUB_TOKEN,
      )
      .option(
        '-t --apiToken <apiToken>',
        'credentials to DX Scanner, can be set as ENV variable DXSCANNER_API_TOKEN',
        process.env.DXSCANNER_API_TOKEN,
      )
      .option('--ci', 'CI mode', process.env.CI === 'true')
      .option('-d --details', 'print details in reports')
      .option(
        '--fail <impact>',
        `exits process with code 1 for any non-practicing condition of given level (${Object.keys(PracticeImpact)
          .concat('all')
          .join('|')})`,
        this.validateFailInput,
        PracticeImpact.high,
      )
      .option('--fix', 'tries to fix problems automatically', false)
      .option('--fixPattern <pattern>', 'fix only rules with IDs matching the regex')
      .option('-j --json', 'print report in JSON', false)
      .option('--html [path]', 'save report in HTML', false)
      .option('-r --recursive', 'scan all components recursively in all sub folders', false)
      .action(Run.run)
      .on('--help', () => {
        console.log('');
        console.log('Examples:');
        console.log('  dx-scanner run');
        console.log('  dx-scanner run . --fail=high');
        console.log('  dx-scanner run github.com/DXHeroes/dx-scanner');
      });

    // cmd: init
    cmder.command('init').description('Initialize DX Scanner configuration').action(Init.run);

    // cmd: practices
    cmder
      .command('practices')
      .description('List all practices id with name and impact')
      .option('-j --json', 'print practices in JSON')
      .action(Practices.run);

    await cmder.parseAsync(process.argv);

    this.notifyUpdate();
  }

  private static validateFailInput = (value: string | undefined) => {
    if (value && !_.includes(PracticeImpact, value)) {
      const msg = `Invalid value for --fail: ${value}\nValid values are: ${Object.keys(PracticeImpact).concat('all').join(', ')}\n`;
      logfile.error(msg);
      console.error(msg);
      process.exit(1);
    }

    return value;
  };

  private static notifyUpdate = () => {
    updateNotifier({ pkg: pjson, updateCheckInterval: 0, shouldNotifyInNpmScript: true }).notify();
  };

  private static async enableLogfile() {
    logfile.enabled = true;
    logfile.log('DX Scanner execution log ' + new Date().toLocaleTimeString());
  }
}

process.on('uncaughtException', errorHandler);

export default DXScannerCommand;

export * from './reporters/DashboardReporter';
export { ServiceType } from './detectors';
export { CollectorsData } from './collectors/DataCollector';
export { ProgrammingLanguage, ProjectComponent, ProjectComponentPlatform, ProjectComponentFramework, ProjectComponentType } from './model';
