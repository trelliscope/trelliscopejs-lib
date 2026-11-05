import { describe, it, expect, vi } from 'vitest';

// jsApi pulls in the full React component tree via `trelliscopeAppFunc` (only used by
// the builder's render methods, not by meta inference). Stub the heavy imports so this
// unit test loads just the builder/inference logic.
vi.mock('./trelliscopeAppFunc', () => ({ default: () => null }));
vi.mock('./slices/metaDataAPI', () => ({ metaIndex: Symbol('metaIndex') }));

import { Trelliscope, StringMeta, FactorMeta, NumberMeta } from './jsApi';

// Build a Trelliscope app from rows and return its resolved metas keyed by varname.
function metasFor(data: Datum[], keycols: string[], metas?: IMeta[]) {
  const app = Trelliscope({ data, name: 'test', keycols, ...(metas ? { metas } : {}) });
  const list = app.displays.test.displayInfo.metas;
  return Object.fromEntries(list.map((m) => [m.varname, m]));
}

// Rows where `siteSubject` is a categorical code that JS's lenient Date.parse()
// happily turns into a date (Date.parse('01-001') succeeds) — the original bug.
const data = [
  { id: 'a', siteSubject: '01-001', visitDate: '2024-01-15', enrolled: '2024-01-15 09:30:00', age: 34 },
  { id: 'b', siteSubject: '02-014', visitDate: '2024-02-20', enrolled: '2024-02-20 11:00:00', age: 51 },
  { id: 'c', siteSubject: '01-007', visitDate: '2024-03-02', enrolled: '2024-03-02 08:15:00', age: 28 },
] as unknown as Datum[];

describe('meta type inference', () => {
  it('classifies code-like categorical values as factor, not date', () => {
    expect(metasFor(data, ['id']).siteSubject.type).toBe('factor');
  });

  it('still detects ISO dates and datetimes', () => {
    const metas = metasFor(data, ['id']);
    expect(metas.visitDate.type).toBe('date');
    expect(metas.enrolled.type).toBe('datetime');
  });

  it('detects numeric columns', () => {
    expect(metasFor(data, ['id']).age.type).toBe('number');
  });
});

describe('declared metas are primary, inference is the fallback', () => {
  it('uses a declared meta over inference for that column', () => {
    const metas = metasFor(data, ['id'], [StringMeta({ varname: 'siteSubject' })]);
    expect(metas.siteSubject.type).toBe('string');
  });

  it('still infers columns that are not declared', () => {
    const metas = metasFor(data, ['id'], [StringMeta({ varname: 'siteSubject' })]);
    expect(metas.visitDate.type).toBe('date');
    expect(metas.age.type).toBe('number');
  });

  it('derives factor levels from the data when none are supplied', () => {
    const metas = metasFor(data, ['id'], [FactorMeta({ varname: 'siteSubject' })]);
    expect(metas.siteSubject.type).toBe('factor');
    expect(metas.siteSubject.levels).toEqual(['01-001', '01-007', '02-014']);
  });

  it('respects explicitly supplied factor levels', () => {
    const levels = ['02-014', '01-007', '01-001'];
    const metas = metasFor(data, ['id'], [FactorMeta({ varname: 'siteSubject', levels })]);
    expect(metas.siteSubject.levels).toEqual(levels);
  });
});

describe('backward compatibility', () => {
  it('omitting metas leaves inference behavior intact', () => {
    const metas = metasFor(data, ['id']);
    // every column still gets a meta, and a non-declared NumberMeta-eligible column
    // is inferred as before
    expect(Object.keys(metas).sort()).toEqual(['age', 'enrolled', 'id', 'siteSubject', 'visitDate']);
    expect(NumberMeta({ varname: 'age' }).type).toBe('number');
  });
});
