import { Issue } from '../../model';
import { Paginated } from '../../../../inspectors/common/Paginated';

export const getIssuesResponse: Paginated<Issue> = {
  items: [
    {
      user: {
        id: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        login: 'stefanor',
        url: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
      },
      url: 'https://bitbucket.org/pypy/pypy',
      body:
        'As mentioned on IRC over the last few days.\r\n\r\nWhen I translate a JIT pypy2.7 from the 7.2 release branch \\(or hg HEAD\\) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:\r\n\r\n```\r\n$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\r\nRPython traceback:\r\n  File "rpython_jit_metainterp_10.c", line 25430, in send_loop_to_backend\r\n  File "rpython_jit_backend_aarch64.c", line 1690, in AssemblerARM64_assemble_loop\r\n  File "rpython_jit_backend_aarch64.c", line 4551, in AssemblerARM64__assemble\r\n  File "rpython_jit_backend_aarch64.c", line 13381, in AssemblerARM64__walk_operations\r\n  File "rpython_jit_backend_aarch64.c", line 52643, in ResOpAssembler_emit_op_zero_array\r\nFatal RPython error: AssertionError\r\n```\r\n\r\n`--jit off` works as usual.\r\n\r\nI can’t reproduce this with the pre-built [pypy2.7-v7.2.0rc0-aarch64.tar.bz2](https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2), and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.\r\n\r\nFull build log attached. No toolchain details in there, but it will be almost identical to [this build, without JIT](https://buildd.debian.org/status/fetch.php?pkg=pypy3&arch=arm64&ver=7.2.0%7Erc1%2Bdfsg-1&stamp=1570132096&raw=0).\r\n\r\nHardware: kvm guest on an APM [X-Gene 1](https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov) \\(a Mustang, something like that\\)',
      createdAt: '2019-10-06T19:52:53.940697+00:00',
      updatedAt: '2019-10-15T15:47:34.904758+00:00',
      closedAt: null,
      state: 'new',
      id: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
    },
  ],
  totalCount: 1,
  hasNextPage: true,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};
