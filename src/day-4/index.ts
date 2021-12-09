import {flow} from "fp-ts/function";
import {readFile} from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

interface GameData {
    sequence: number[];
    boards: number[][][];
}

const parseFileContent = (input: string): GameData => {
    const matches = Array.from(input.matchAll(/([\d,]+$)\n+(((^(\s*([0-9]|[1-9][0-9])\s*){5}$\n?){5})+)/gm))[0];
    const sequence = matches[1]?.toString()?.split(",").map(x => Number.parseInt(x));
    const boards = matches[2].split(/\n\s*\n/)
        .map(boardString => boardString.split(/\n/)
            .map(row => row.trim().split(/\s+/)
                .map(x => Number.parseInt(x))));
    return {
        sequence,
        boards,
    };
}

interface ProcessingGame {
    boards: number[][][];
    winnerNumber?: number;
    index: number;
    sum?: number;
}

const transpose = (matrix: number[][]) => {
    return matrix[0].map((_col, i) => matrix.map(row => row[i]));
}
const processDataPerRow = (gameData: GameData) => gameData.sequence.reduce<ProcessingGame>((acc, number, index) => {
    if (acc.winnerNumber !== undefined) return acc;
    acc.boards = acc.boards.map(board => board.map(row => row.filter(value => value !== number)));
    const boardsWithEmptyRow = acc.boards.find(board => board.find(row => !row.length));
    if (index >= 5 && boardsWithEmptyRow) {
        acc.winnerNumber = number;
        acc.index = index;
        acc.sum = boardsWithEmptyRow.reduce((sum, row) => row.reduce((partialSum, value) => partialSum + value, sum), 0);
    }
    return acc;
}, { boards: gameData.boards, index: -1 });

function processData(gameData: GameData) {
    const processingGameRows = processDataPerRow(gameData);
    const processingGameColumn = processDataPerRow({...gameData, boards: gameData.boards.map(transpose)});
    return processingGameRows.index < processingGameColumn.index ? processingGameRows : processingGameColumn;
}

const multiplyNumberBySum = (p: ProcessingGame) => (p.winnerNumber || 0) * (p.sum || 0);

export const partOne = flow(
    readFile,
    TE.map(parseFileContent),
    TE.map(processData),
    TE.map((p: ProcessingGame) => multiplyNumberBySum(p)),
);

partOne('src/day-4/input.txt')()
    .then(a => E.isRight(a) ? console.log('Part one: What will your final score be if you choose that board? ', a.right) : console.log('Error: ', a.left))
    .catch(a => console.log('Error: ', a));
