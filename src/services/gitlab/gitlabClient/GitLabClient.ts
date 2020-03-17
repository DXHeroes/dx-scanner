import axios from 'axios';
import { injectable } from 'inversify';
import debug from 'debug';

@injectable()
export class GitLabClient {
  protected headers: { [header: string]: string };
  protected host: string;
  protected timeout: number;

  constructor({ token, host = 'https://gitlab.com', timeout = 5000 }: ClientOptions) {
    this.headers = {};
    this.host = host;
    this.timeout = timeout;

    if (token) this.headers['Authorization'] = `Bearer ${token}`;
  }

  protected createAxiosInstance() {
    return axios.create({
      baseURL: `${this.host}/api/v4`,
      timeout: this.timeout,
      headers: { ...this.headers },
    });
  }
}

export interface ClientOptions {
  token?: string;
  host?: string;
  timeout?: number;
}
