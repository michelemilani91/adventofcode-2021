import {flow} from "fp-ts/function";
import {readFile} from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as t from "io-ts";

const BinaryNumber = t.array(t.union([ t.literal('0'), t.literal('1') ]));

type BinaryNumber = t.TypeOf<typeof BinaryNumber>;

const parseBinaryNumber = (binaryNumber: string[]) => BinaryNumber.decode(binaryNumber);

interface BinaryCounter {
    numberOf0: number;
    numberOf1: number;
}

const countBitsPerColumn = (a: readonly BinaryNumber[]) => {
    return a.reduce<BinaryCounter[]>((counter, value) => {
        return value.map<BinaryCounter>((bit, index) => {
            const previousValue = counter[index] || { numberOf0: 0, numberOf1: 0 };
            switch (bit) {
                case '0':
                    previousValue.numberOf0++;
                    break;
                case '1':
                    previousValue.numberOf1++;
                    break;
            }
            return previousValue;
        });
    }, []);
};

const calculateGammaRate = (a: readonly BinaryCounter[]) => {
    return Number.parseInt(a.map(x => x.numberOf0 > x.numberOf1 ? '0' : '1').join(''), 2);
}

const calculateEpsilonRate = (a: readonly BinaryCounter[]) => {
    return Number.parseInt(a.map(x => x.numberOf0 < x.numberOf1 ? '0' : '1').join(''), 2);
}

export const partOne = flow(
    readFile,
    TE.map((a: Readonly<string>) => a.split("\n")),
    TE.map(A.map((b: string) => b.split(''))),
    TE.map((a: readonly string[][]) => a.map(parseBinaryNumber)),
    TE.chainEitherKW(E.sequenceArray),
    TE.map(countBitsPerColumn),
    TE.map((a: readonly BinaryCounter[]) => calculateGammaRate(a) * calculateEpsilonRate(a))
);


partOne('src/day-3/input.txt')()
    .then(a => E.isRight(a) ? console.log('Part one: What is the power consumption of the submarine? ', a.right) : console.log('Error: ', a.left))
    .catch(a => console.log('Error: ', a));
