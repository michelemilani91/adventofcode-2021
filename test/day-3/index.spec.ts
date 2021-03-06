import * as E from "fp-ts/Either";
import { partOne, partTwo } from "@app/day-3";

describe("AdventOfCode 2021 - Day 3", () => {
  it("Return result 198 for first challenge", async () => {
    const result = await partOne("test/day-3/input.txt")();
    const expected = E.right(198);
    expect(result).toEqual(expected);
  });
  it("Return result 230 for second challenge", async () => {
    const result = await partTwo("test/day-3/input.txt")();
    const expected = E.right(230);
    expect(result).toEqual(expected);
  });
});
