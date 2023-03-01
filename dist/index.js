"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = exports.findLargestTimeDifference = exports.sortByTime = exports.getFilteredArray = void 0;
function createHandler(ttl, fetchFunc) {
    const cache = {};
    let lastFetchTime = 0; // Time of last fetch
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.query.id);
            if (!isNaN(id) && id > 0) {
                if (cache[id] && Date.now() - cache[id].timestamp <= ttl) {
                    const _a = cache[id], { timestamp } = _a, responseWithoutTimestamp = __rest(_a, ["timestamp"]);
                    res.status(200).json(responseWithoutTimestamp);
                    return;
                }
                const result = yield fetchFunc(id);
                const filteredArray = (0, exports.getFilteredArray)(result);
                const timeDifferenceResult = (0, exports.findLargestTimeDifference)((0, exports.sortByTime)(filteredArray));
                if (timeDifferenceResult.largestDifference === 0 ||
                    filteredArray.length <= 1) {
                    let response = {
                        success: true,
                        error: null,
                        result: {
                            range: null,
                        },
                    };
                    cache[id] = Object.assign(Object.assign({}, response), { timestamp: Date.now() });
                    res.status(200).json(response);
                }
                else {
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
                    cache[id] = Object.assign(Object.assign({}, response), { timestamp: Date.now() });
                    res.status(200).json(response);
                }
            }
            else {
                res.status(400).json({
                    success: false,
                    error: "Something went wrong",
                    result: null,
                });
            }
        });
    };
}
exports.createHandler = createHandler;
const getFilteredArray = (arr) => {
    const averagePrice = arr.reduce((accumulator, currentItem) => accumulator + currentItem.price, 0) / arr.length;
    return arr.filter((item) => item.price > averagePrice);
};
exports.getFilteredArray = getFilteredArray;
const sortByTime = (arr) => {
    return arr.sort((a, b) => a.time.getTime() - b.time.getTime());
};
exports.sortByTime = sortByTime;
const findLargestTimeDifference = (arr) => {
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
exports.findLargestTimeDifference = findLargestTimeDifference;
console.log((0, exports.findLargestTimeDifference)([
    { price: 1, time: new Date("2023-01-01") },
    { price: 0, time: new Date("2023-01-02") },
    { price: 1, time: new Date("2023-01-03") },
    { price: 1, time: new Date("2023-01-06") },
]));
module.exports = { createHandler };
//# sourceMappingURL=index.js.map