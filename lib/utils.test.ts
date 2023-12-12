import { SearchParams } from './services/types';
import { generateQueryObject } from './utils';

describe('generateQueryObject', () => {
  it('should return an object with only truthy values', () => {
    const params = {
      sort: 'endsAt',
      active: '',
      q: '',
    } satisfies SearchParams;

    expect(generateQueryObject(params)).toEqual({
      sort: 'endsAt',
    });
  });

  it('should return an empty object if all values are falsy', () => {
    const params = {
      sort: '',
      active: '',
      q: '',
    } as unknown as SearchParams;

    expect(generateQueryObject(params)).toEqual({});
  });

  it('should return all values if all values are truthy', () => {
    const params = {
      sort: 'endsAt',
      active: 'true',
      q: 'test',
    } satisfies SearchParams;

    expect(generateQueryObject(params)).toEqual({
      sort: 'endsAt',
      active: 'true',
      q: 'test',
    });
  });
});
