import { Container } from 'inversify';
import { ProgrammingLanguage } from '../../model';
export declare const bindLanguageContext: (container: Container) => void;
export declare const DETECT_LANGUAGE_TAG = "language";
/**
 * Language tag for Project Component Detector. Determines which language this detector supports
 * @param language Language this detector is able to detect
 */
export declare const detectsLanguage: (language: ProgrammingLanguage) => (target: any, targetKey: string, index?: number | undefined) => void;
export declare const getProjectComponentDetectorFactory: (container: Container) => (language: ProgrammingLanguage) => unknown[];
//# sourceMappingURL=languageContextBinding.d.ts.map