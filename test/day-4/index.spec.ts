import * as E from "fp-ts/Either";
import {partOne} from "@app/day-4";

describe("AdventOfCode 2021 - Day 4", () => {
    it("Return result 4512 for first challenge", async () => {
        const result = await partOne('test/day-4/input.txt')();
        const expected = E.right(4512);
        expect(result).toEqual(expected);
    });
});
