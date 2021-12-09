import { flow } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { readFile } from "@app/utils/file";

function countIncreases(a: ReadonlyArray<number>) {
    return a.filter((value, index, array) => index - 1 >= 0 && value > array[index - 1]).length;
}

export const partOne = flow(
    readFile,
    TE.map((a: Readonly<string>) => a.split("\n")),
    TE.map((a: ReadonlyArray<string>) => a.map((value) => Number.parseInt(value))),
    TE.map(countIncreases)
);

partOne('src/day-1/input.txt')()
    .then(a => E.isRight(a) ? console.log('How many measurements are larger than the previous measurement? ', a.right) : console.log('Error: ', a.left))
    .catch(a => console.log('Error: ', a));

export const partTwo = flow(
    readFile,
    TE.map((a: Readonly<string>) => a.split("\n")),
    TE.map((a: ReadonlyArray<string>) => a.map((value) => Number.parseInt(value))),
    TE.map((a: ReadonlyArray<number>) => a.map((value, index, array) => value + array[index-1] + array[index-2]).slice(2)),
    TE.map(countIncreases)
);

partTwo('src/day-1/input.txt')()
    .then(a => E.isRight(a) ? console.log('How many sums are larger than the previous sum? ', a.right) : console.log('Error: ', a.left))
    .catch(a => console.log('Error: ', a));