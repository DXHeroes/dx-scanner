import axios from 'axios';
import { injectable } from 'inversify';

@injectable()
export class GitLabClient {
  protected headers: { [header: string]: string };
  protected host: string;
  protected timeout: number;

  constructor({ token, jobToken, oauthToken, host = 'https://gitlab.com', timeout = 20000 }: ClientOptions) {
    this.headers = {};
    this.host = host;
    this.timeout = timeout;

    // Handle auth tokens
    if (oauthToken) this.headers.authorization = `Bearer ${oauthToken}`;
    else if (jobToken) this.headers['job-token'] = jobToken;
    else if (token) this.headers['private-token'] = token;
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
  jobToken?: string;
  oauthToken?: string;
  host?: string;
  timeout?: number;
}
