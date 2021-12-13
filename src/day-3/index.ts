import { flow } from "fp-ts/function";
import { readFile } from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as t from "io-ts";

const BinaryNumber = t.array(t.union([t.literal("0"), t.literal("1")]));

type BinaryNumber = t.TypeOf<typeof BinaryNumber>;

const parseBinaryNumber = (binaryNumber: string[]) =>
  BinaryNumber.decode(binaryNumber);

interface BinaryCounter {
  numberOf0: number;
  numberOf1: number;
}

const countBitsPerColumn = (
  a: readonly BinaryNumber[]
): readonly BinaryCounter[] =>
  a.reduce<BinaryCounter[]>(
    (counter, value) =>
      value.map<BinaryCounter>((bit, index) => {
        const previousValue = counter[index] || { numberOf0: 0, numberOf1: 0 };
        switch (bit) {
          case "0":
            previousValue.numberOf0++;
            break;
          case "1":
            previousValue.numberOf1++;
            break;
        }
        return previousValue;
      }),
    []
  );

const calculateGammaRate = (a: readonly BinaryCounter[]): number =>
  Number.parseInt(
    a.map((x) => (x.numberOf0 > x.numberOf1 ? "0" : "1")).join(""),
    2
  );

const calculateEpsilonRate = (a: readonly BinaryCounter[]): number =>
  Number.parseInt(
    a.map((x) => (x.numberOf0 < x.numberOf1 ? "0" : "1")).join(""),
    2
  );

export const partOne = flow(
  readFile,
  TE.map((a: Readonly<string>) => a.split("\n")),
  TE.map(A.map((b: string) => b.split(""))),
  TE.map((a: readonly string[][]) => a.map(parseBinaryNumber)),
  TE.chainEitherKW(E.sequenceArray),
  TE.map(countBitsPerColumn),
  TE.map(
    (a: readonly BinaryCounter[]) =>
      calculateGammaRate(a) * calculateEpsilonRate(a)
  )
);

partOne("src/day-3/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part one: What is the power consumption of the submarine? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));

const calculateRating = (
  array: readonly BinaryNumber[],
  evaluatedValue: "0" | "1",
  column: number = 0
): BinaryNumber => {
  const { numberOf1, numberOf0 } = countBitsPerColumn(array)[column];
  const bitValue =
    evaluatedValue == "1" ? numberOf1 >= numberOf0 : numberOf1 < numberOf0;
  const filteredArray = array.filter(
    (a) => Boolean(Number(a[column])) === bitValue
  );
  return filteredArray.length === 1
    ? filteredArray[0]
    : calculateRating(filteredArray, evaluatedValue, column + 1);
};

const calculateOxygenGeneratorRating = (a: readonly BinaryNumber[]): number => {
  return Number.parseInt(calculateRating(a, "1").join(""), 2);
};

const calculateCO2ScrubberRating = (a: readonly BinaryNumber[]): number => {
  return Number.parseInt(calculateRating(a, "0").join(""), 2);
};

export const partTwo = flow(
  readFile,
  TE.map((a: Readonly<string>) => a.split("\n")),
  TE.map(A.map((b: string) => b.split(""))),
  TE.map((a: readonly string[][]) => a.map(parseBinaryNumber)),
  TE.chainEitherKW(E.sequenceArray),
  TE.map(
    (a: readonly BinaryNumber[]) =>
      calculateOxygenGeneratorRating(a) * calculateCO2ScrubberRating(a)
  )
);

partTwo("src/day-3/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part two: What is the life support rating of the submarine? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));
