import { flow } from "fp-ts/function";
import { readFile } from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";

interface Coordinate {
  x: number;
  y: number;
}

interface CoordinateRange {
  start: Coordinate;
  end: Coordinate;
}

const lineToCoordinatesPair = (b: string): CoordinateRange => {
  const matches = Array.from(
    b.matchAll(/([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/g)
  )[0];
  return {
    start: {
      x: Number.parseInt(matches[1].toString()),
      y: Number.parseInt(matches[2].toString()),
    },
    end: {
      x: Number.parseInt(matches[3].toString()),
      y: Number.parseInt(matches[4].toString()),
    },
  };
};

const filterHorizontalAndVertical = (r: CoordinateRange[]) =>
  r.filter((c) => c.start.x === c.end.x || c.start.y === c.end.y);

const matrixFromRange = (start: number, end: number, y: number): number[][] => {
  const range = Array(end + 1)
    .fill(0)
    .map((val, idx) => (start != end && idx >= start ? 1 : val));
  return Array(y + 1)
    .fill(Array(end + 1).fill(0))
    .map((val, idx) => (idx === y ? range : val));
};

const transpose = (matrix: number[][]) => {
  return matrix[0].map((_col, i) => matrix.map((row) => row[i]));
};

const mapCoordinates = (c: CoordinateRange): number[][] => {
  const startX = Math.min(c.start.x, c.end.x);
  const endX = Math.max(c.start.x, c.end.x);
  const endY = Math.max(c.start.y, c.end.y);
  if (startX !== endX) return matrixFromRange(startX, endX, endY);
  const startY = Math.min(c.start.y, c.end.y);
  return transpose(matrixFromRange(startY, endY, endX));
};

const sum = (finalMatrix: number[][], matrix: number[][]) => {
  // TODO remove for loop in favor of a function
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      finalMatrix[i] = finalMatrix[i] || [];
      finalMatrix[i][j] = finalMatrix[i][j] || 0;
      finalMatrix[i][j] += matrix[i][j];
    }
  }
  return finalMatrix;
};

const countOverlaps = (m: number[][]) =>
  m.reduce(
    (sum: number, row: number[]) => sum + row.filter((val) => val > 1).length,
    0
  );

export const partOne = flow(
  readFile,
  TE.map((a: Readonly<string>) => a.split("\n")),
  TE.map(A.map(lineToCoordinatesPair)),
  TE.map(filterHorizontalAndVertical),
  TE.map(A.map(mapCoordinates)),
  TE.map((a) => a.reduce(sum, [])),
  TE.map(countOverlaps)
);

partOne("src/day-5/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part one: At how many points do at least two lines overlap? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));
