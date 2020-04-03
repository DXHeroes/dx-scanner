import { Group } from '../../../../services/gitlab/gitlabClient/resources/UsersOrGroups';

export const gitLabListGroupsResponseFactory = (items: Group[] = []): Group[] => {
  return items;
};
