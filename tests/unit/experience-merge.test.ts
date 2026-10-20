import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePayload, parsePeriod, planMerge, validateRecord } from '../../src/lib/experience-merge.ts';

const staticEntries = [
  { id: 'vcl-research-experience', start: '2026-09', end: 'present' },
  { id: 'cmha-experience', start: '2025-05', end: '2025-08' },
  { id: 'swb-experience', start: '2024-02', end: '2024-02' },
];

const record = (over: Record<string, unknown> = {}) => ({
  id: 'new-role',
  role: 'Machine Learning Intern',
  organization: 'Example Co',
  period: 'May 2026 – August 2026',
  highlights: ['Did a thing'],
  ...over,
});

test('known ids keep the static entry (live API returns a shorter CMHA summary)', () => {
  const live = {
    experiences: [
      {
        id: 'cmha-experience',
        organization: 'Canadian Mental Health Association',
        role: 'IT Intern',
        period: 'May 2025 – August 2025',
        highlights: ['Developed booking workflows with Power Apps and Power Automate'],
      },
    ],
  };
  const plan = planMerge(staticEntries, live);
  assert.deepEqual(plan.additions, []);
  assert.deepEqual(plan.ignored, ['cmha-experience']);
});

test('new ids are inserted by date', () => {
  const plan = planMerge(staticEntries, { experiences: [record()] });
  assert.equal(plan.additions.length, 1);
  assert.equal(plan.additions[0].before, 'cmha-experience');
});

test('ongoing new roles go before older ongoing roles only when they started later', () => {
  const plan = planMerge(staticEntries, { experiences: [record({ period: 'Oct 2026 – Present' })] });
  assert.equal(plan.additions[0].before, 'vcl-research-experience');
});

test('unparseable periods are appended', () => {
  const plan = planMerge(staticEntries, { experiences: [record({ period: 'Summer term' })] });
  assert.equal(plan.additions[0].before, null);
});

test('duplicate API ids are collapsed to the first record', () => {
  const plan = planMerge(staticEntries, { experiences: [record(), record({ role: 'Second copy' })] });
  assert.equal(plan.additions.length, 1);
  assert.equal(plan.additions[0].record.role, 'Machine Learning Intern');
});

test('malformed payloads change nothing', () => {
  for (const payload of [null, undefined, 'oops', 42, {}, { experiences: 'nope' }, { experiences: [] }]) {
    const plan = planMerge(staticEntries, payload);
    assert.equal(plan.additions.length, 0);
  }
});

test('records missing required fields are rejected', () => {
  const { records, rejected } = parsePayload({
    experiences: [record({ id: '' }), record({ role: '   ' }), record({ organization: 7 }), record({ id: 'Bad Id!' }), record()],
  });
  assert.equal(records.length, 1);
  assert.equal(rejected, 4);
});

test('highlights are cleaned and non-strings dropped', () => {
  const rec = validateRecord(record({ highlights: ['  a  b ', 3, null, ''] }));
  assert.deepEqual(rec?.highlights, ['a b']);
});

test('period parsing', () => {
  assert.deepEqual(parsePeriod('May 2025 – August 2025'), { start: '2025-05', end: '2025-08' });
  assert.deepEqual(parsePeriod('Sep 2026 – Present'), { start: '2026-09', end: 'present' });
  assert.deepEqual(parsePeriod('Sept. 2024'), { start: '2024-09', end: '2024-09' });
  assert.equal(parsePeriod('Fall term'), null);
});
