import { buildFilePath, parseId, removeUndefinedFields } from "../helpers.js";

describe("helpers", () => {
  test("removeUndefinedFields removes only undefined keys", () => {
    const input = {
      name: "Carbon",
      count: 3,
      optional: undefined,
      nullable: null,
    };
    const result = removeUndefinedFields(input);

    expect(result).toEqual({ name: "Carbon", count: 3, nullable: null });
    expect(Object.prototype.hasOwnProperty.call(result, "optional")).toBe(
      false,
    );
  });

  test("parseId parses numeric strings", () => {
    expect(parseId("42")).toBe(42);
  });

  test("buildFilePath prefixes files path", () => {
    expect(buildFilePath("image.png")).toBe("/files/image.png");
  });
});
