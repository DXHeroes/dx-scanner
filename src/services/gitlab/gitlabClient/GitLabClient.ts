import axios from 'axios';
import { injectable } from 'inversify';
import { bundler } from 'gitlab/dist/types/core/infrastructure';
import { MergeRequests } from '../gitlabClient/resources/MergeRequests';
import { Issues } from '../gitlabClient/resources/Issues';
import { Commits } from '../gitlabClient/resources/Commits';
import { Projects } from '../gitlabClient/resources/Projects';
import { Users } from '../gitlabClient/resources/UsersOrGroups';

@injectable()
export class GitLabConstructor {
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

export const GitLabClient = bundler({ MergeRequests, Issues, Commits, Projects, Users });

export type GitLabClient = InstanceType<typeof GitLabClient>;

export interface ClientOptions {
  token?: string;
  jobToken?: string;
  oauthToken?: string;
  host?: string;
}
