import { createTestContainer, TestContainerContext } from './inversify.config';
import { initialize } from './init.configurator';
import * as fs from 'fs';

describe('Init Configurator', () => {
  let containerCtx: TestContainerContext;

  const setProperty = (object: NodeJS.Process, property: string | number | symbol, value: jest.Mock<any, any>) => {
    const originalProperty = Object.getOwnPropertyDescriptor(object, property);
    Object.defineProperty(object, property, { value });
    return originalProperty;
  };

  beforeEach(async () => {
    containerCtx = createTestContainer({ uri: '.' });
  });

  it('Creates a .yaml config file', () => {
    const mockExit = jest.fn();
    // mock fs
    const mockExistFs = jest.spyOn(fs, 'existsSync');
    const mockWriteFs = jest.spyOn(fs, 'writeFileSync');
    mockExistFs.mockReturnValue(false);
    // avoid indefinite test run
    setProperty(process, 'exit', mockExit);
    initialize('.', containerCtx.container);
    expect(mockExit).toHaveBeenCalledWith(0);
    // test
    expect(mockWriteFs).toHaveBeenCalled();
    mockExit.mockRestore();
  });

  it('Does not create a .yaml config if a similar file exists', () => {
    const mockExit = jest.fn();
    // mock fs
    const mockExistFs = jest.spyOn(fs, 'existsSync');
    const mockWriteFs = jest.spyOn(fs, 'writeFileSync');
    mockExistFs.mockReturnValue(true);
    // avoid indefinite test run
    setProperty(process, 'exit', mockExit);
    initialize('.', containerCtx.container);
    expect(mockExit).toHaveBeenCalledWith(0);
    // test
    expect(mockWriteFs).not.toHaveBeenCalled();
    mockExit.mockRestore();
  });
});
