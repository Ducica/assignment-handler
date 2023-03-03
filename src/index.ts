import { Request, Response } from "express";

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

type FetchFunction = (id: number) => Promise<FetchResult>;
function createHandler(ttl: number, fetchFunc: FetchFunction) {
  const cache: { [key: string]: ResponseType } = {};
  const lock: { [key: string]: boolean } = {};
  return async function (req: Request, res: Response) {
    const id = parseInt(req.query.id as string);
    if (!isNaN(id) && id > 0) {
      if (cache[id] && Date.now() - cache[id].timestamp <= ttl) {
        const { timestamp, ...responseWithoutTimestamp } = cache[id];
        res.status(200).json(responseWithoutTimestamp);
        return;
      }
      while (lock[id]) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      lock[id] = true;
      const result = await fetchFunc(id);

      const filteredArray = getFilteredArray(result);
      if (filteredArray.length <= 1) {
        const response = {
          success: true,
          error: null,
          result: {
            range: null,
          },
        };
        res.status(200).json(response);
        lock[id] = false;
      }

      const timeDifferenceResult: LargestTimeDifference =
        findLargestTimeDifference(sortByTime(filteredArray));
      if (timeDifferenceResult.largestDifference === 0) {
        const response = {
          success: true,
          error: null,
          result: {
            range: null,
          },
        };
        cache[id] = { ...response, timestamp: Date.now() };
        res.status(200).json(response);
        lock[id] = false;
      } else {
        const response = {
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
        lock[id] = false;
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
// module.exports = createHandler;
