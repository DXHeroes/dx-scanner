/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PracticeMetadata } from '../model';
import { injectable } from 'inversify';
import { IPractice } from './IPractice';

function DxPracticeWrapperDecorator(practiceMetadata: PracticeMetadata) {
  return function classDecorator<T extends new (...args: any[]) => Record<string, unknown>>(constructor: T) {
    return class extends constructor {
      getMetadata = () => {
        return { ...practiceMetadata, defaultImpact: practiceMetadata.impact, matcher: this };
      };
    };
  };
}

export function DxPractice(metadata: PracticeMetadata) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (target: any) => {
    return DxPracticeWrapperDecorator(metadata)(injectable()(target));
  };
}

export interface IPracticeWithMetadata extends IPractice {
  getMetadata(): PracticeMetadata;
}
