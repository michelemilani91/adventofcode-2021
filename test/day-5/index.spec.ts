import * as E from "fp-ts/Either";
import { partOne } from "@app/day-5";

describe("AdventOfCode 2021 - Day 5", () => {
  it("Return result 5 for first challenge", async () => {
    const result = await partOne("test/day-5/input.txt")();
    const expected = E.right(5);
    expect(result).toEqual(expected);
  });
});
