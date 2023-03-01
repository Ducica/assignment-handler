import { Request, Response, NextFunction } from "express";

type FetchResult = { price: number; time: Date }[];
type LargestTimeDifference = {
  largestDifference: number;
  item1: Date;
  item2: Date;
};
type ResponseType = {
  success: boolean;
  error: null | string;
  result: {
    range: {
      start: Date;
      end: Date;
    } | null;
  };
  timestamp: number;
};
function createHandler(ttl: number, fetchFunc: any) {
  const cache: { [key: string]: ResponseType } = {};
  let lastFetchTime: number = 0; // Time of last fetch

  return async function (req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.query.id as string);
    if (!isNaN(id) && id > 0) {
      if (cache[id] && Date.now() - cache[id].timestamp <= ttl) {
        console.log("returning from cache");
        const { timestamp, ...responseWithoutTimestamp } = cache[id];
        res.status(200).json(responseWithoutTimestamp);
        return;
      }
      const result = await fetchFunc(id);

      const filteredArray = getFilteredArray(result);
      const timeDifferenceResult: LargestTimeDifference =
        findLargestTimeDifference(sortByTime(filteredArray));
      if (
        timeDifferenceResult.largestDifference === 0 ||
        filteredArray.length <= 1
      ) {
        let response = {
          success: true,
          error: null,
          result: {
            range: null,
          },
        };
        cache[id] = { ...response, timestamp: Date.now() };
        res.status(200).json(response);
      } else {
        let response = {
          success: true,
          error: null,
          result: {
            range: {
              start: timeDifferenceResult.item1,
              end: timeDifferenceResult.item2,
            },
          },
        };
        cache[id] = { ...response, timestamp: Date.now() };
        res.status(200).json(response);
      }
    } else {
      res.status(400).json({
        success: false,
        error: "Something went wrong",
        result: null,
      });
    }
  };
}

export const getFilteredArray = (arr: FetchResult): FetchResult => {
  const averagePrice =
    arr.reduce(
      (accumulator, currentItem) => accumulator + currentItem.price,
      0
    ) / arr.length;
  return arr.filter((item) => item.price > averagePrice);
};

export const sortByTime = (arr: FetchResult): FetchResult => {
  return arr.sort((a, b) => a.time.getTime() - b.time.getTime());
};

export const findLargestTimeDifference = (
  arr: FetchResult
): LargestTimeDifference => {
  let largestDifference = 0;
  let largestDifferenceItem1 = arr[0].time;
  let largestDifferenceItem2 = arr[1].time;

  for (let i = 1; i < arr.length; i++) {
    const difference = arr[i].time.getTime() - arr[i - 1].time.getTime();
    if (difference > largestDifference) {
      largestDifference = difference;
      largestDifferenceItem1 = arr[i - 1].time;
      largestDifferenceItem2 = arr[i].time;
    }
  }

  return {
    largestDifference,
    item1: largestDifferenceItem1,
    item2: largestDifferenceItem2,
  };
};

export { createHandler };
module.exports = createHandler;
