import { numberOfPagesForChunk } from "../../helpers/chunks";

test("the number of pages for each chunk is correct", () => {
  expect(
    numberOfPagesForChunk({
      numberOfPages: 50,
      currentPage: 10,
      daysLeft: 5,
      repeat: 2
    })
  ).toBe(19);

  expect(
    numberOfPagesForChunk({
      numberOfPages: 30,
      currentPage: 30,
      daysLeft: 100,
      repeat: 1
    })
  ).toBe(1);

  expect(
    numberOfPagesForChunk({
      numberOfPages: 30,
      currentPage: 30,
      daysLeft: 1,
      repeat: 1
    })
  ).toBe(1);
});

test("that correct Error is thrown with NaN inputs", () => {
  try {
    numberOfPagesForChunk({
      numberOfPages: "Test",
      currentPage: 30,
      daysLeft: 1,
      repeat: 1
    });
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(err.message).toBe(
      "Not all arguments for numberOfPagesForChunk are numbers."
    );
  }

  try {
    numberOfPagesForChunk({
      numberOfPages: 30,
      currentPage: "Test",
      daysLeft: 1,
      repeat: 1
    });
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(err.message).toBe(
      "Not all arguments for numberOfPagesForChunk are numbers."
    );
  }

  try {
    numberOfPagesForChunk({
      numberOfPages: 50,
      currentPage: 30,
      daysLeft: "Test",
      repeat: 1
    });
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(err.message).toBe(
      "Not all arguments for numberOfPagesForChunk are numbers."
    );
  }

  try {
    numberOfPagesForChunk({
      numberOfPages: 50,
      currentPage: 30,
      daysLeft: 1,
      repeat: "Test"
    });
    throw new Error("Error wasn't thrown");
  } catch (err) {
    expect(err.message).toBe(
      "Not all arguments for numberOfPagesForChunk are numbers."
    );
  }
});
