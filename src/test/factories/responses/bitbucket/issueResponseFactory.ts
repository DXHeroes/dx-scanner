/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import Bitbucket from 'bitbucket';

export const bitbucketIssueResponseFactory = (params: Partial<Bitbucket.Schema.Issue>): Bitbucket.Schema.Issue => {
  return _.merge(
    {
      priority: 'major',
      kind: 'bug',
      repository: {
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy',
          },
          html: {
            href: 'https://bitbucket.org/pypy/pypy',
          },
          avatar: {
            href: 'https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930',
          },
        },
        type: 'repository',
        name: 'pypy',
        full_name: 'pypy/pypy',
        uuid: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
      },
      links: {
        attachments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/attachments',
        },
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086',
        },
        watch: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/watch',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/comments',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/issues/3086/arm64-jit-lots-of-crashes',
        },
        vote: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/vote',
        },
      },
      reporter: {
        display_name: 'Stefano Rivera',
        uuid: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/0b25ad2bcea703792d5a7bfc521a47ca?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSR-5.png',
          },
        },
        nickname: 'stefanor',
        type: 'user',
        account_id: '557058:efb9f360-846e-4950-afaa-c6a5da7e77b2',
      },
      title: 'arm64 JIT: Lots of crashes',
      votes: 0,
      watches: 2,
      content: {
        raw:
          'As mentioned on IRC over the last few days.\r\n\r\nWhen I translate a JIT pypy2.7 from the 7.2 release branch \\(or hg HEAD\\) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:\r\n\r\n```\r\n$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\r\nRPython traceback:\r\n  File "rpython_jit_metainterp_10.c", line 25430, in send_loop_to_backend\r\n  File "rpython_jit_backend_aarch64.c", line 1690, in AssemblerARM64_assemble_loop\r\n  File "rpython_jit_backend_aarch64.c", line 4551, in AssemblerARM64__assemble\r\n  File "rpython_jit_backend_aarch64.c", line 13381, in AssemblerARM64__walk_operations\r\n  File "rpython_jit_backend_aarch64.c", line 52643, in ResOpAssembler_emit_op_zero_array\r\nFatal RPython error: AssertionError\r\n```\r\n\r\n`--jit off` works as usual.\r\n\r\nI can’t reproduce this with the pre-built [pypy2.7-v7.2.0rc0-aarch64.tar.bz2](https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2), and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.\r\n\r\nFull build log attached. No toolchain details in there, but it will be almost identical to [this build, without JIT](https://buildd.debian.org/status/fetch.php?pkg=pypy3&arch=arm64&ver=7.2.0%7Erc1%2Bdfsg-1&stamp=1570132096&raw=0).\r\n\r\nHardware: kvm guest on an APM [X-Gene 1](https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov) \\(a Mustang, something like that\\)',
        markup: 'markdown',
        html:
          '<p>As mentioned on IRC over the last few days.</p>\n<p>When I translate a JIT pypy2.7 from the 7.2 release branch (or hg HEAD) under cPython on arm64, I get an interpreter with an unstable JIT. It constantly crashes, with some variant of:</p>\n<div class="codehilite"><pre><span></span>$ pypy/goal/pypy-c lib_pypy/_sqlite3_build.py\nRPython traceback:\n  File <span class="s2">&quot;rpython_jit_metainterp_10.c&quot;</span>, line <span class="m">25430</span>, in send_loop_to_backend\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">1690</span>, in AssemblerARM64_assemble_loop\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">4551</span>, in AssemblerARM64__assemble\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">13381</span>, in AssemblerARM64__walk_operations\n  File <span class="s2">&quot;rpython_jit_backend_aarch64.c&quot;</span>, line <span class="m">52643</span>, in ResOpAssembler_emit_op_zero_array\nFatal RPython error: AssertionError\n</pre></div>\n\n\n<p><code>--jit off</code> works as usual.</p>\n<p>I can’t reproduce this with the pre-built <a data-is-external-link="true" href="https://bitbucket.org/pypy/pypy/downloads/pypy2.7-v7.2.0rc0-aarch64.tar.bz2" rel="nofollow">pypy2.7-v7.2.0rc0-aarch64.tar.bz2</a>, and it can translate pypy2.7 to produce a working JIT. OS is Debian sid. Haven’t tried pypy3.6, yet.</p>\n<p>Full build log attached. No toolchain details in there, but it will be almost identical to <a data-is-external-link="true" href="https://buildd.debian.org/status/fetch.php?pkg=pypy3&amp;arch=arm64&amp;ver=7.2.0%7Erc1%2Bdfsg-1&amp;stamp=1570132096&amp;raw=0" rel="nofollow">this build, without JIT</a>.</p>\n<p>Hardware: kvm guest on an APM <a data-is-external-link="true" href="https://www.gigabyte.com/Server-Motherboard/MP30-AR1-rev-11#ov" rel="nofollow">X-Gene 1</a> (a Mustang, something like that)</p>',
      },
      assignee: {
        display_name: 'Maciej Fijalkowski',
        uuid: '{99b67766-d1ba-42c6-a80e-543f7318428b}',
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/users/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D',
          },
          html: {
            href: 'https://bitbucket.org/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D/',
          },
          avatar: {
            href:
              'https://secure.gravatar.com/avatar/bfc96d2a02d9113edb992eb96c205c5a?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMF-0.png',
          },
        },
        nickname: 'fijal',
        type: 'user',
        account_id: '557058:4805a215-8388-4152-9c83-043e10a4435a',
      },
      state: 'new',
      created_on: '2019-10-06T19:52:53.940697+00:00',
      updated_on: '2019-10-15T15:47:34.904758+00:00',
      type: 'issue',
      id: 3086,
    },
    params,
  );
};
