import axios from 'axios';
import { injectable } from 'inversify';
import debug from 'debug';
import https from 'https';

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
    debug('GitlabClient')(this.host);
    debug('GitlabClient')(this.timeout);
    return axios.create({
      baseURL: `${this.host}/api/v4`,
      timeout: this.timeout,
      headers: { ...this.headers },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}

export interface ClientOptions {
  token?: string;
  host?: string;
  timeout?: number;
}
