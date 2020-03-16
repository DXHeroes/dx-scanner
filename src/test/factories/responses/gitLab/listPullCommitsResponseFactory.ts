import { Commit } from '../../../../services/gitlab/gitlabClient/resources/MergeRequests';

export const gitLabListPullCommitsResponseFactory = (items: Commit[] = []) => {
  return items;
};
