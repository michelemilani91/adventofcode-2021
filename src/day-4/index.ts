import { flow } from "fp-ts/function";
import { readFile } from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

interface GameData {
  sequence: number[];
  boards: number[][][];
}

const parseFileContent = (input: string): GameData => {
  const matches = Array.from(
    input.matchAll(/([\d,]+$)\n+(((^(\s*([0-9]|[1-9][0-9])\s*){5}$\n?){5})+)/gm)
  )[0];
  const sequence = matches[1]
    ?.toString()
    ?.split(",")
    .map((x) => Number.parseInt(x));
  const boards = matches[2].split(/\n\s*\n/).map((boardString) =>
    boardString.split(/\n/).map((row) =>
      row
        .trim()
        .split(/\s+/)
        .map((x) => Number.parseInt(x))
    )
  );
  return {
    sequence,
    boards,
  };
};

const transpose = (matrix: number[][]) => {
  return matrix[0].map((_col, i) => matrix.map((row) => row[i]));
};

const boardToPossibilities = (board: number[][]) => [
  ...board,
  ...transpose(board),
];

interface TurnCount {
  reducedBoard: number[][];
  index: number;
  sequenceValue: number;
}

const countTurnsToGetEmptyRow = (
  sequence: number[],
  board: number[][],
  index: number = 0,
  sequenceValue: number = -1
): TurnCount => {
  if (sequence.length === 0)
    return { reducedBoard: board, index, sequenceValue };
  const [nextVal, ...otherPartOfSequence] = sequence;
  const reducedBoard = board.map((row) => row.filter((v) => v !== nextVal));
  const newSequence = reducedBoard.find((p) => p.length === 0)
    ? []
    : otherPartOfSequence;
  return countTurnsToGetEmptyRow(newSequence, reducedBoard, index + 1, nextVal);
};

const toTurnCounts = (gameData: GameData): TurnCount[] =>
  gameData.boards.map((board) =>
    countTurnsToGetEmptyRow(gameData.sequence, boardToPossibilities(board))
  );

const findFirstWinnerBoard = (turnCounts: readonly TurnCount[]): TurnCount =>
  turnCounts.reduce((acc, val) => (acc.index < val.index ? acc : val));

interface ProcessingResult {
  sum: number;
  sequenceValue: number;
}

const processData = ({
  reducedBoard,
  sequenceValue,
}: TurnCount): ProcessingResult => ({
  sequenceValue,
  sum: reducedBoard
    .slice(0, reducedBoard.length / 2)
    .reduce((sum, row) => row.reduce((rowSum, val) => rowSum + val, sum), 0),
});

const multiplyNumberBySum = (p: ProcessingResult) => p.sequenceValue * p.sum;

export const partOne = flow(
  readFile,
  TE.map(parseFileContent),
  TE.map(toTurnCounts),
  TE.map(findFirstWinnerBoard),
  TE.map(processData),
  TE.map(multiplyNumberBySum)
);

partOne("src/day-4/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part one: What will your final score be if you choose that board? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));

const findLastWinnerBoard = (turnCounts: readonly TurnCount[]): TurnCount =>
  turnCounts.reduce((acc, val) => (acc.index > val.index ? acc : val));

export const partTwo = flow(
  readFile,
  TE.map(parseFileContent),
  TE.map(toTurnCounts),
  TE.map(findLastWinnerBoard),
  TE.map(processData),
  TE.map(multiplyNumberBySum)
);

partTwo("src/day-4/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part two: Once it wins, what would its final score be? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));
