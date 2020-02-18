import axios from 'axios';
import { injectable } from 'inversify';

@injectable()
export class GitLabClient {
  private readonly headers: { [header: string]: string };
  protected host: string;

  constructor({ token, jobToken, oauthToken, host = 'https://gitlab.com' }: ClientOptions) {
    this.headers = {};
    this.host = host;

    // Handle auth tokens
    if (oauthToken) this.headers.authorization = `Bearer ${oauthToken}`;
    else if (jobToken) this.headers['job-token'] = jobToken;
    else if (token) this.headers['private-token'] = token;
  }

  createAxiosInstance() {
    return axios.create({
      baseURL: `${this.host}/api/v4`,
      timeout: 1000,
      headers: { ...this.headers },
    });
  }
}

export interface ClientOptions {
  token?: string;
  jobToken?: string;
  oauthToken?: string;
  host?: string;
}
