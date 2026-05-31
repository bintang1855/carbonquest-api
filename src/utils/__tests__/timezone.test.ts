import {
  convertDatesToJakarta,
  formatDateIndonesia,
  getJakartaDayRange,
  getJakartaMonthRange,
  getJakartaWeekRange,
  toJakartaTime,
} from "../timezone.js";

describe("timezone utils", () => {
  test("toJakartaTime converts UTC to Jakarta offset", () => {
    const result = toJakartaTime("2026-05-31T00:00:00.000Z");
    expect(result).toBe("2026-05-31T07:00:00+07:00");
  });

  test("convertDatesToJakarta converts date-like fields recursively", () => {
    const input = {
      createdAt: new Date("2026-05-31T00:00:00.000Z"),
      nested: {
        updated_at: "2026-05-31T01:02:03.000Z",
        count: 1,
      },
      name: "ok",
    };

    const result = convertDatesToJakarta(input);

    expect(result.createdAt).toBe("2026-05-31T07:00:00+07:00");
    expect(result.nested.updated_at).toBe("2026-05-31T08:02:03+07:00");
    expect(result.name).toBe("ok");
  });

  test("getJakartaDayRange returns a 24 hour window", () => {
    const { start, end } = getJakartaDayRange(
      new Date("2026-05-31T10:00:00.000Z"),
    );

    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
    expect(start.toISOString()).toBe("2026-05-30T17:00:00.000Z");
    expect(end.toISOString()).toBe("2026-05-31T17:00:00.000Z");
  });

  test("getJakartaWeekRange covers 7 days", () => {
    const date = new Date("2026-06-03T12:00:00.000Z");
    const { start, end } = getJakartaWeekRange(date);

    expect(end.getTime() - start.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
    expect(start.getTime()).toBeLessThanOrEqual(date.getTime());
    expect(end.getTime()).toBeGreaterThan(date.getTime());
  });

  test("getJakartaMonthRange spans the month", () => {
    const { start, end } = getJakartaMonthRange(
      new Date("2026-05-15T12:00:00.000Z"),
    );

    expect(start.toISOString()).toBe("2026-04-30T17:00:00.000Z");
    expect(end.toISOString()).toBe("2026-05-31T17:00:00.000Z");
  });

  test("formatDateIndonesia returns a readable string", () => {
    const result = formatDateIndonesia("2026-05-31T00:00:00.000Z");

    expect(result).not.toBeNull();
    expect(result).toContain("2026");
  });
});
