import {readFile} from "@app/utils/file";
import * as E from "fp-ts/Either";

describe("Task Either for reading file", () => {
    it("Return error for non existing file", async () => {
        const result = await readFile('test/utils/non-exists.txt')();
        const expected = E.left("ENOENT: no such file or directory, open 'test/utils/non-exists.txt'");
        expect(result).toEqual(expected);
    });
});