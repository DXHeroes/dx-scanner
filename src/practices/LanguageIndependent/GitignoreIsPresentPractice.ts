import fs, { unlink } from 'fs';
import os from 'os';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import gi from 'gitignore';
import inquirer from 'inquirer';
import cli from 'cli-ux';
import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { FixerContext } from '../../contexts/fixer/FixerContext';

const noop = () => undefined;

@DxPractice({
  id: 'LanguageIndependent.GitignoreIsPresent',
  name: 'Create a .gitignore',
  impact: PracticeImpact.high,
  suggestion:
    'Add .gitignore to your directory. .gitignore allows you to ignore files, such as editor backup files, build products or local configuration overrides that you never want to commit into a repository.',
  reportOnlyOnce: true,
  url: 'https://git-scm.com/docs/gitignore',
})
export class GitignoreIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexGitignore = new RegExp('.gitignore', 'i');

    const files = await ctx.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
    const rootFiles = await ctx.root.fileInspector.scanFor(regexGitignore, '/', { shallow: true });

    if (files.length > 0 || rootFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    // do necessary checks
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;
    const availableTypes = await promisify(gi.getTypes)();
    if (!availableTypes) return;

    // get the gitignore type
    let type: string | undefined;
    if (availableTypes.includes(ctx.projectComponent.language)) {
      type = ctx.projectComponent.language;
    } else if (!ctx.argumentsProvider?.ci) {
      // get type from user
      const name = 'Pick a gitignore template';
      type = (await cli.action.pauseAsync(() => inquirer.prompt({ name, type: 'list', choices: availableTypes })))[name];
    } else {
      return;
    }

    // download data to tmp file
    const tmpFilePath = `${os.tmpdir()}/${uuidv4()}`;
    const writeTo = fs.createWriteStream(tmpFilePath);
    await new Promise((resolve) => {
      writeTo.on('finish', resolve); // continue once the write is finished
      gi.writeFile({ type: type!, file: writeTo }, noop);
    });

    // move data to gitignore file
    const data = fs.readFileSync(tmpFilePath, 'utf8');
    await inspector.writeFile('.gitignore', data);
    await promisify(unlink)(tmpFilePath);
  }
}
