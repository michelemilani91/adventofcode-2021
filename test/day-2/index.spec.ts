import * as E from "fp-ts/Either";
import { partOne, partTwo } from "@app/day-2";

describe("AdventOfCode 2021 - Day 2", () => {
  it("Return result 150 for first challenge", async () => {
    const result = await partOne("test/day-2/input.txt")();
    const expected = E.right(150);
    expect(result).toEqual(expected);
  });
  it("Return result 900 for second challenge", async () => {
    const result = await partTwo("test/day-2/input.txt")();
    const expected = E.right(900);
    expect(result).toEqual(expected);
  });
});
