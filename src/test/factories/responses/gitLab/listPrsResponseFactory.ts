import Bitbucket from 'bitbucket';
import { MergeRequest } from '../../../../services/gitlab/gitlabClient/resources/MergeRequests';

export const gitLabListPRsResponseFactory = (items: MergeRequest[] = []): MergeRequest[] => {
  return items;
};
