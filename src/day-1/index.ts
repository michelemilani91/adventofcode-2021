import { flow } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { readFile } from "@app/utils/file";

export const main = flow(
    readFile,
    TE.map((a: string) => a.split("\n")),
    TE.map((a: string[]) => a.map((x) => Number.parseInt(x))),
    TE.map((a: number[]) => a.filter((value, index, array) => index-1 >= 0 && value > array[index-1]).length)
);

main('src/day-1/input.txt')()
    .then(a => E.isRight(a) ? console.log('How many measurements are larger than the previous measurement? ', a.right) : console.log('Error: ', a.left))
    .catch(a => console.log('Error: ', a));