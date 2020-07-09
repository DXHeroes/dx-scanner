export const yarnShellResponse =
  '{"type":"auditAdvisory","data":{"resolution":{"id":1523,"path":"yeoman-gen-run>yeoman-environment>lodash","dev":false,"bundled":false,"optional":false},"advisory":{"findings":[{"version":"4.17.15","paths":["@commitlint/config-conventional>conventional-changelog-conventionalcommits>lodash","@commitlint/lint>@commitlint/parse>conventional-commits-parser>lodash","@commitlint/lint>@commitlint/rules>@commitlint/ensure>lodash","cli-ux>lodash","eslint>inquirer>lodash","generator-license>yeoman-generator>yeoman-environment>inquirer>lodash","yeoman-environment>inquirer>lodash","inquirer>lodash","eslint>lodash","eslint>table>lodash","table>lodash","generator-license>yeoman-generator>async>lodash","generator-license>yeoman-generator>yeoman-environment>yeoman-generator>async>lodash","yeoman-environment>yeoman-generator>async>lodash","generator-license>yeoman-generator>lodash","generator-license>yeoman-generator>yeoman-environment>grouped-queue>lodash","yeoman-environment>grouped-queue>lodash","generator-license>yeoman-generator>yeoman-environment>yeoman-generator>grouped-queue>lodash","yeoman-environment>yeoman-generator>grouped-queue>lodash","generator-license>yeoman-generator>yeoman-environment>lodash","yeoman-environment>lodash","generator-license>yeoman-generator>yeoman-environment>yeoman-generator>lodash","yeoman-environment>yeoman-generator>lodash","lodash","npm-check-updates>lodash","yeoman-gen-run>inquirer>lodash","yeoman-gen-run>lodash","yeoman-gen-run>yeoman-environment>grouped-queue>lodash","yeoman-gen-run>yeoman-environment>inquirer>lodash","yeoman-gen-run>yeoman-environment>lodash"]}],"id":1523,"created":"2020-05-20T01:36:49.357Z","updated":"2020-07-01T20:43:49.860Z","deleted":null,"title":"Prototype Pollution","found_by":{"link":"","name":"posix","email":""},"reported_by":{"link":"","name":"posix","email":""},"module_name":"lodash","cves":["CVE-2019-10744"],"vulnerable_versions":">=0.0.0","patched_versions":"<0.0.0","overview":"All versions of `lodash` are vulnerable to Prototype Pollution.  The function `zipObjectDeep` allows a malicious user to modify the prototype of `Object` if the property identifiers are user-supplied. Being affected by this issue requires zipping objects based on user-provided property arrays.  \\n\\nThis vulnerability causes the addition or modification of an existing property that will exist on all objects and may lead to Denial of Service or Code Execution under specific circumstances.\\n\\n","recommendation":"No fix is currently available. Consider using an alternative package until a fix is made available.","references":"- [HackerOne Report](https://hackerone.com/reports/712065)\\n- [GitHub Issue](https://github.com/lodash/lodash/issues/4744)","access":"public","severity":"low","cwe":"CWE-471","metadata":{"module_type":"","exploitability":3,"affected_components":""},"url":"https://npmjs.com/advisories/1523"}}}\n' +
  '{"type":"auditSummary","data":{"vulnerabilities":{"info":0,"low":31,"moderate":0,"high":0,"critical":0},"dependencies":1071,"devDependencies":0,"optionalDependencies":0,"totalDependencies":1071}}\n';

export const npmShellResponse = {
  stdout:
    '{\n' +
    '  "actions": [\n' +
    '    {\n' +
    '      "action": "review",\n' +
    '      "module": "lodash",\n' +
    '      "resolves": [\n' +
    '        {\n' +
    '          "id": 1523,\n' +
    '          "path": "yeoman-gen-run>yeoman-environment>lodash",\n' +
    '          "dev": false,\n' +
    '          "bundled": false,\n' +
    '          "optional": false\n' +
    '        }\n' +
    '      ]\n' +
    '    }\n' +
    '  ],\n' +
    '  "advisories": {\n' +
    '    "1523": {\n' +
    '      "id": 1523,\n' +
    '      "created": "2020-05-20T01:36:49.357Z",\n' +
    '      "updated": "2020-07-01T20:43:49.860Z",\n' +
    '      "deleted": null,\n' +
    '      "title": "Prototype Pollution",\n' +
    '      "found_by": {\n' +
    '        "link": "",\n' +
    '        "name": "posix",\n' +
    '        "email": ""\n' +
    '      },\n' +
    '      "reported_by": {\n' +
    '        "link": "",\n' +
    '        "name": "posix",\n' +
    '        "email": ""\n' +
    '      },\n' +
    '      "module_name": "lodash",\n' +
    '      "cves": [\n' +
    '        "CVE-2019-10744"\n' +
    '      ],\n' +
    '      "vulnerable_versions": ">=0.0.0",\n' +
    '      "patched_versions": "<0.0.0",\n' +
    '      "overview": "All versions of `lodash` are vulnerable to Prototype Pollution.  The function `zipObjectDeep` allows a malicious user to modify the prototype of `Object` if the property identifiers are user-supplied. Being affected by this issue requires zipping objects based on user-provided property arrays.  \\n\\nThis vulnerability causes the addition or modification of an existing property that will exist on all objects and may lead to Denial of Service or Code Execution under specific circumstances.\\n\\n",\n' +
    '      "recommendation": "No fix is currently available. Consider using an alternative package until a fix is made available.",\n' +
    '      "references": "- [HackerOne Report](https://hackerone.com/reports/712065)\\n- [GitHub Issue](https://github.com/lodash/lodash/issues/4744)",\n' +
    '      "access": "public",\n' +
    '      "severity": "low",\n' +
    '      "cwe": "CWE-471",\n' +
    '      "metadata": {\n' +
    '        "module_type": "",\n' +
    '        "exploitability": 3,\n' +
    '        "affected_components": ""\n' +
    '      },\n' +
    '      "url": "https://npmjs.com/advisories/1523"\n' +
    '    }\n' +
    '  },\n' +
    '  "muted": [],\n' +
    '  "metadata": {\n' +
    '    "vulnerabilities": {\n' +
    '      "info": 0,\n' +
    '      "low": 32,\n' +
    '      "moderate": 0,\n' +
    '      "high": 0,\n' +
    '      "critical": 0\n' +
    '    },\n' +
    '    "dependencies": 1042,\n' +
    '    "devDependencies": 0,\n' +
    '    "optionalDependencies": 1,\n' +
    '    "totalDependencies": 1043\n' +
    '  },\n' +
    '  "runId": "b1ed2c65-6377-4ee5-975b-b4deaf3a38af"\n' +
    '}\n',
  code: 1,
};
