import { flow } from "fp-ts/function";
import { readFile } from "@app/utils/file";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as t from "io-ts";
import * as E from "fp-ts/Either";

const Command = t.type({
  action: t.union([t.literal("forward"), t.literal("down"), t.literal("up")]),
  value: t.number,
});

type Command = t.TypeOf<typeof Command>;

interface Position {
  horizontal: number;
  depth: number;
}

const parseCommand = (command: string) => {
  const [action, value] = command.split(" ");
  return Command.decode({ action, value: Number.parseInt(value) });
};

const executeCommands = (a: readonly Command[]) => {
  return a.reduce<Position>(
    (position, command) => {
      switch (command.action) {
        case "forward":
          position.horizontal += command.value;
          break;
        case "down":
          position.depth += command.value;
          break;
        case "up":
          position.depth -= command.value;
          break;
      }
      return position;
    },
    { horizontal: 0, depth: 0 }
  );
};

export const partOne = flow(
  readFile,
  TE.map((a: Readonly<string>) => a.split("\n")),
  TE.map(A.map(parseCommand)),
  TE.chainEitherKW(E.sequenceArray),
  TE.map(executeCommands),
  TE.map((a: Position) => a.depth * a.horizontal)
);

partOne("src/day-2/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part one: What do you get if you multiply your final horizontal position by your final depth? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));

interface Position3D {
  horizontal: number;
  depth: number;
  aim: number;
}

const execute3DCommands = (a: readonly Command[]) => {
  return a.reduce<Position3D>(
    (position, command) => {
      switch (command.action) {
        case "forward":
          position.horizontal += command.value;
          position.depth += command.value * position.aim;
          break;
        case "down":
          position.aim += command.value;
          break;
        case "up":
          position.aim -= command.value;
          break;
      }
      return position;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );
};

export const partTwo = flow(
  readFile,
  TE.map((a: Readonly<string>) => a.split("\n")),
  TE.map(A.map(parseCommand)),
  TE.chainEitherKW(E.sequenceArray),
  TE.map(execute3DCommands),
  TE.map((a: Position) => a.depth * a.horizontal)
);

partTwo("src/day-2/input.txt")()
  .then((a) =>
    E.isRight(a)
      ? console.log(
          "Part two: What do you get if you multiply your final horizontal position by your final depth? ",
          a.right
        )
      : console.log("Error: ", a.left)
  )
  .catch((a) => console.log("Error: ", a));
