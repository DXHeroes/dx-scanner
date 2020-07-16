import { scanningStrategy } from '../../scanner/__MOCKS__/ScanningStrategy.mock';
import { GitServiceUtils } from './GitServiceUtils';
import {
  ProjectComponentFramework,
  ProgrammingLanguage,
  ProjectComponentPlatform,
  ProjectComponentType,
  ProjectComponent,
} from '../../model';
import { ServiceType } from '../../detectors/IScanningStrategy';

describe('GitServiceUtils', () => {
  it('Returns url', () => {
    const response = GitServiceUtils.getUrlToRepo('https://www.github.com/DXHeroes/dx-scanner.git', scanningStrategy);
    expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
  });

  it('Returns url', () => {
    const response = GitServiceUtils.getUrlToRepo(
      'https://www.bitbucket.com/pypy/pypy.git',
      { ...scanningStrategy, serviceType: ServiceType.bitbucket },
      'component',
    );
    expect(response).toEqual('https://www.bitbucket.com/pypy/pypy/src/master/component');
  });

  it('Parses url', () => {
    const response = GitServiceUtils.parseUrl('https://www.github.com/DXHeroes/dx-scanner.git');
    expect(response).toEqual({ host: 'www.github.com', owner: 'DXHeroes', repoName: 'dx-scanner', protocol: 'https' });
  });

  it('Returns repo name', () => {
    const response = GitServiceUtils.getRepoName('https://www.github.com/DXHeroes/dx-scanner.git', '../dx-scanner');
    expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
  });

  it('Returns local path to repo', () => {
    const response = GitServiceUtils.getRepoName(undefined, '../dx-scanner');
    expect(response).toEqual('../dx-scanner');
  });

  it('Returns component path', () => {
    const componentMock: ProjectComponent = {
      framework: ProjectComponentFramework.UNKNOWN,
      language: ProgrammingLanguage.JavaScript,
      path: '../dx-scannerSAJK/component',
      platform: ProjectComponentPlatform.BackEnd,
      type: ProjectComponentType.Library,
      repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner',
    };
    scanningStrategy.localPath = '../dx-scannerSAJK/';

    const response = GitServiceUtils.getComponentPath(componentMock, scanningStrategy);
    expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner/tree/master/component');
  });

  it('Returns component path', () => {
    const componentMock: ProjectComponent = {
      framework: ProjectComponentFramework.UNKNOWN,
      language: ProgrammingLanguage.JavaScript,
      path: '../dx-scannerSAJK',
      platform: ProjectComponentPlatform.BackEnd,
      type: ProjectComponentType.Library,
      repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner',
    };

    const response = GitServiceUtils.getComponentPath(componentMock, { ...scanningStrategy, localPath: '../dx-scannerSAJK' });
    expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
  });

  it('Returns component path without credentials', () => {
    const componentMock: ProjectComponent = {
      framework: ProjectComponentFramework.UNKNOWN,
      language: ProgrammingLanguage.JavaScript,
      path: '../dx-scannerSAJK',
      platform: ProjectComponentPlatform.BackEnd,
      type: ProjectComponentType.Library,
      repositoryPath: 'https://user:passwrod@www.github.com/DXHeroes/dx-scanner',
    };

    const response = GitServiceUtils.getComponentPath(componentMock, { ...scanningStrategy, localPath: '../dx-scannerSAJK' });
    expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
  });

  it('Returns component name if it is root component', () => {
    const componentMock: ProjectComponent = {
      framework: ProjectComponentFramework.UNKNOWN,
      language: ProgrammingLanguage.JavaScript,
      path: '../dx-scannerSAJK/',
      platform: ProjectComponentPlatform.BackEnd,
      type: ProjectComponentType.Library,
      repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner',
    };
    scanningStrategy.localPath = '../dx-scannerSAJK/';

    const response = GitServiceUtils.getComponentName(componentMock, scanningStrategy);
    expect(response).toEqual('DXHeroes/dx-scanner');
  });

  it('Returns component name if it is not root component', () => {
    const componentMock: ProjectComponent = {
      framework: ProjectComponentFramework.UNKNOWN,
      language: ProgrammingLanguage.JavaScript,
      path: '../dx-scannerSAJK/component',
      platform: ProjectComponentPlatform.BackEnd,
      type: ProjectComponentType.Library,
      repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner/component',
    };
    scanningStrategy.localPath = '../dx-scannerSAJK/';

    const response = GitServiceUtils.getComponentName(componentMock, scanningStrategy);
    expect(response).toEqual('component');
  });
});
