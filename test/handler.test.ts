import {
  getFilteredArray,
  sortByTime,
  findLargestTimeDifference,
} from "../src";

describe("getFilteredArray", () => {
  it("filters the array based on the average price", () => {
    const input = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 0, time: new Date("2023-01-02") },
      { price: 1, time: new Date("2023-01-03") },
    ];
    const expectedOutput = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 1, time: new Date("2023-01-03") },
    ];
    expect(getFilteredArray(input)).toEqual(expectedOutput);
  });

  it("returns an empty array when given an empty array", () => {
    expect(getFilteredArray([])).toEqual([]);
  });

  it("returns empty array when all prices are equal", () => {
    const input = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 1, time: new Date("2023-01-02") },
      { price: 1, time: new Date("2023-01-03") },
    ];
    expect(getFilteredArray(input)).toEqual([]);
  });
});

describe("sortByTime", () => {
  it("sorts the array by time in ascending order", () => {
    const input = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 1, time: new Date("2023-01-03") },
      { price: 0, time: new Date("2023-01-02") },
    ];
    const expectedOutput = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 0, time: new Date("2023-01-02") },
      { price: 1, time: new Date("2023-01-03") },
    ];
    expect(sortByTime(input)).toEqual(expectedOutput);
  });
});

describe("findLargestTimeDifference", () => {
  it("returns the largest time difference between two consecutive dates from a sorted array and also the two items that have the greatest difference ", () => {
    const input = [
      { price: 1, time: new Date("2023-01-01") },
      { price: 0, time: new Date("2023-01-02") },
      { price: 1, time: new Date("2023-01-03") },
      { price: 1, time: new Date("2023-01-06") },
    ];
    const expectedOutput = {
      largestDifference:
        new Date("2023-01-06").getTime() - new Date("2023-01-03").getTime(),
      item1: new Date("2023-01-03"),
      item2: new Date("2023-01-06"),
    };
    expect(findLargestTimeDifference(input)).toEqual(expectedOutput);
  });
});
