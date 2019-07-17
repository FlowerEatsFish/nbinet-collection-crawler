export type DataType = 'keyword' | 'isbn';

export interface BookDetailField {
  bookKey: string;
  bookValue: string;
}

export interface CollectionField {
  library: string | null;
  callNumber: string | null;
  status: string | null;
}

export interface DetailType {
  bookDetail: BookDetailField[] | null;
  collection: CollectionField[] | null;
  url: string;
}

export type NbinetCollectionFunction =
  (keyword: string, dataType?: DataType) => Promise<DetailType | DetailType[] | null>;

declare const nbinetCollectionApi: NbinetCollectionFunction;

export default nbinetCollectionApi;
