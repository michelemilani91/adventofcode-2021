import * as E from "fp-ts/Either";
import { partOne, partTwo } from "@app/day-1";

describe("AdventOfCode 2021 - Day 1", () => {
  it("Return result 7 for first challenge", async () => {
    const result = await partOne("test/day-1/input.txt")();
    const expected = E.right(7);
    expect(result).toEqual(expected);
  });
  it("Return result 5 for second challenge", async () => {
    const result = await partTwo("test/day-1/input.txt")();
    const expected = E.right(5);
    expect(result).toEqual(expected);
  });
});
