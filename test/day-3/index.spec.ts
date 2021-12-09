import * as E from "fp-ts/Either";
import { partOne } from "@app/day-3";

describe("AdventOfCode 2021 - Day 3", () => {
    it("Return result 198 for first challenge", async () => {
        const result = await partOne('test/day-3/input.txt')();
        const expected = E.right(198);
        expect(result).toEqual(expected);
    });
});
