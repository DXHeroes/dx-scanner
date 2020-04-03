import { Project } from '../../../../services/gitlab/gitlabClient/resources/Projects';

export const gitLabListProjectsResponseFactory = (items: Project[] = []): Project[] => {
  return items;
};
