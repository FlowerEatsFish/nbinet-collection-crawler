import nbinetCollection from '../src/index';
import { DetailType } from '../index';

const timeout = 60 * 1000;

describe('Run demo', (): void => {
  it('Should get one result as Object', async (): Promise<void> => {
    const result = await nbinetCollection(
      '護理學博士教育課程規劃與評值研討會',
      'keyword'
    );

    expect(typeof result).toBe('object');
    expect(Array.isArray(result)).toBeFalsy();
    expect(result).not.toBeNull();
  }, timeout);

  it('Should get results as Array and no more than 50', async (): Promise<void> => {
    const result = await nbinetCollection(
      '9789867494122',
      'isbn'
    );

    expect(Array.isArray(result)).toBeTruthy();
    expect((result as DetailType[]).length).toBeLessThanOrEqual(50);
  }, timeout);

  it('Should do not have any result as Null', async (): Promise<void> => {
    const result = await nbinetCollection(
      'blablablablablablablablablablablabla',
      'keyword'
    );

    expect(result).toBeNull();
  }, timeout);
});
