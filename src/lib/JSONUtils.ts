import { ErrorFactory } from './errors/ErrorFactory';

export class JSONUtils {
  static readAsJSON(text: string) {
    let content: JSON;

    try {
      content = JSON.parse(text);
    } catch (error) {
      throw ErrorFactory.newInternalError('JSON parse error');
    }
    return content;
  }
}
