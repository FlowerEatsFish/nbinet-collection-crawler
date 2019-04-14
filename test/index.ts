import nbinetCollection from '../src/index';

const timeout = 60 * 1000;

describe('Run demo', (): void => {
  it('Should get one result as Object', async (): Promise<void> => {
    const result: object = await nbinetCollection(
      '護理學博士教育課程規劃與評值研討會',
      'keyword'
    );

    expect(
      (typeof result === 'object') && (result !== null) && (!Array.isArray(result))
    ).toBeTruthy();
  }, timeout);

  it('Should get results as Array and no more than 50', async (): Promise<void> => {
    const result: object[] = await nbinetCollection(
      '9789867494122',
      'isbn'
    );

    expect(
      (Array.isArray(result)) && (result.length <= 50)
    ).toBeTruthy();
  }, timeout);

  it('Should do not have any result as Null', async (): Promise<void> => {
    const result: null = await nbinetCollection(
      'blablablablablablablablablablablabla',
      'keyowrd'
    );

    expect(result == null).toBeTruthy();
  }, timeout);
});
