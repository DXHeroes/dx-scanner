"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContributorsStatsResponse = void 0;
const gitHubNock_1 = require("../../../../test/helpers/gitHubNock");
exports.getContributorsStatsResponse = [
    {
        total: 1,
        weeks: [
            {
                w: 1315699200,
                a: 1,
                d: 1,
                c: 1,
            },
            {
                w: 1316304000,
                a: 0,
                d: 0,
                c: 0,
            },
            {
                w: 1316908800,
                a: 0,
                d: 0,
                c: 0,
            },
        ],
        author: new gitHubNock_1.UserItem('251370', 'Spaceghost'),
    },
];
//# sourceMappingURL=getContributorsStatsResponse.mock.js.map