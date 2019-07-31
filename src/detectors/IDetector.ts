export interface IDetector<P, T> {
  detect(params?: P): Promise<T>;
}
