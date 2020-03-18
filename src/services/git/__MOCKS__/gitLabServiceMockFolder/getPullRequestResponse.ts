import { PullRequest } from '../../model';
import _ from 'lodash';

export const getPullRequestResponse = (params?: Partial<PullRequest>): PullRequest => {
  return _.merge(
    {
      user: {
        id: '4087042',
        login: 'nkipling',
        url: 'https://gitlab.com/nkipling',
      },
      url: 'https://gitlab.com/gitlab-org/gitlab/-/merge_requests/26291',
      body:
        '## What does this MR do?\r\n' +
        '\r\n' +
        'Adds the `package_name` parameter to the `:id/packages` API endpoint. This allows the list of packages returned from this API call to be filtered by `package_name`.\r\n' +
        '\r\n' +
        'Opens up ~frontend work in gitlab-org/gitlab#197920.\r\n' +
        '\r\n' +
        '## Screenshots\r\n' +
        '\r\n' +
        'No visual changes.\r\n' +
        '\r\n' +
        '## Does this MR meet the acceptance criteria?\r\n' +
        '\r\n' +
        '### Conformity\r\n' +
        '\r\n' +
        '- [ ] [Changelog entry](https://docs.gitlab.com/ee/development/changelog.html) \r\n' +
        '- [ ] [Documentation](https://docs.gitlab.com/ee/development/documentation/workflow.html) ([if required](https://docs.gitlab.com/ee/development/documentation/workflow.html#when-documentation-is-required))\r\n' +
        '- [ ] [Code review guidelines](https://docs.gitlab.com/ee/development/code_review.html)\r\n' +
        '- [ ] [Merge request performance guidelines](https://docs.gitlab.com/ee/development/merge_request_performance_guidelines.html)\r\n' +
        '- [ ] [Style guides](https://gitlab.com/gitlab-org/gitlab-ee/blob/master/doc/development/contributing/style_guides.md)\r\n' +
        '- [ ] [Database guides](https://docs.gitlab.com/ee/development/README.html#database-guides)\r\n' +
        '- [ ] [Separation of EE specific content](https://docs.gitlab.com/ee/development/ee_features.html#separation-of-ee-code)\r\n' +
        '\r\n' +
        '### Availability and Testing\r\n' +
        '\r\n' +
        '<!-- What risks does this change pose? How might it affect the quality/performance of the product?\r\n' +
        'What additional test coverage or changes to tests will be needed?\r\n' +
        'Will it require cross-browser testing?\r\n' +
        'See the test engineering process for further guidelines: https://about.gitlab.com/handbook/engineering/quality/test-engineering/ -->\r\n' +
        '\r\n' +
        '<!-- If cross-browser testing is not required, please remove the relevant item, or mark it as not needed: [-] -->\r\n' +
        '\r\n' +
        '- [ ] [Review and add/update tests for this feature/bug](https://docs.gitlab.com/ee/development/testing_guide/index.html). Consider [all test levels](https://docs.gitlab.com/ee/development/testing_guide/testing_levels.html). See the [Test Planning Process](https://about.gitlab.com/handbook/engineering/quality/test-engineering).\r\n' +
        '- [ ] [Tested in all supported browsers](https://docs.gitlab.com/ee/install/requirements.html#supported-web-browsers)\r\n' +
        '- [ ] Informed Infrastructure department of a default or new setting change, if applicable per [definition of done](https://docs.gitlab.com/ee/development/contributing/merge_request_workflow.html#definition-of-done)\r\n' +
        '\r\n' +
        '### Security\r\n' +
        '\r\n' +
        'If this MR contains changes to processing or storing of credentials or tokens, authorization and authentication methods and other items described in [the security review guidelines](https://about.gitlab.com/handbook/engineering/security/#when-to-request-a-security-review):\r\n' +
        '\r\n' +
        '- [ ] Label as ~security and @ mention `@gitlab-com/gl-security/appsec`\r\n' +
        '- [ ] The MR includes necessary changes to maintain consistency between UI, API, email, or other methods\r\n' +
        '- [ ] Security reports checked/validated by a reviewer from the AppSec team ',
      createdAt: '2020-03-02T14:43:01.355Z',
      updatedAt: '2020-03-02T14:52:49.309Z',
      closedAt: null,
      mergedAt: null,
      state: 'opened',
      id: 26291,
      base: {
        repo: {
          url: 'gitlab.com/gitlab-org/gitlab',
          name: 'gitlab',
          id: '278964',
          owner: {
            id: '9970',
            login: 'gitlab-org',
            url: 'https://gitlab.com/groups/gitlab-org',
          },
        },
      },
    },
    params,
  );
};
