export type DataType = "keyword" | "isbn";

export interface BookDetailField {
  bookKey: string | null;
  bookValue: string | null;
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

export type NbinetCollectionFunction = (
  keyword: string,
  dataType?: DataType,
) => Promise<DetailType | DetailType[] | null>;

declare const nbinetCollectionCrawler: NbinetCollectionFunction;

export default nbinetCollectionCrawler;
