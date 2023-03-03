import { Request, Response, NextFunction } from "express";
type FetchResult = {
  price: number;
  time: Date;
}[];
type LargestTimeDifference = {
  largestDifference: number;
  item1: Date;
  item2: Date;
};
type FetchFunction = (id: number) => Promise<FetchResult>;

declare function createHandler(
  ttl: number,
  fetchFunc: FetchFunction
): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFilteredArray: (arr: FetchResult) => FetchResult;
export declare const sortByTime: (arr: FetchResult) => FetchResult;
export declare const findLargestTimeDifference: (
  arr: FetchResult
) => LargestTimeDifference;
export { createHandler };
