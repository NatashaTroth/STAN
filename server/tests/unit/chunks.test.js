import { numberOfPagesForChunk, durationCompleted } from "../../helpers/chunks";

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

test("the duration completed is correct", () => {
  //can use "nice/dividable" numbers since when creating today's chunks the page number is rounded before multiplied with timePerPage (both ints, not floats)
  expect(
    durationCompleted({
      duration: 450,
      startPage: 5,
      currentPage: 10,
      numberPages: 15
    })
  ).toBe(150);

  expect(
    durationCompleted({
      duration: 50,
      startPage: 1,
      currentPage: 5,
      numberPages: 10
    })
  ).toBe(20);

  expect(
    durationCompleted({
      duration: 6,
      startPage: 1,
      currentPage: 2,
      numberPages: 3
    })
  ).toBe(2);

  expect(
    durationCompleted({
      duration: 400,
      startPage: 1,
      currentPage: 1,
      numberPages: 200
    })
  ).toBe(0);

  //current page means, this page still needs to be learned -> therefore 201 means page 200 is completed
  expect(
    durationCompleted({
      duration: 400,
      startPage: 1,
      currentPage: 201,
      numberPages: 200
    })
  ).toBe(400);
  // expect(
  //   durationCompleted({
  //     duration: 60,
  //     startPage: 1,
  //     currentPage: 61,
  //     numberPages: 60
  //   })
  // ).toBe(60);
});

// test("the duration left is correct", () => {
//   //can use "nice/dividable" numbers since when creating today's chunks the page number is rounded before multiplied with timePerPage (both ints, not floats)
//   expect(
//     durationLeft({
//       duration: 450,
//       startPage: 5,
//       currentPage: 10,
//       numberPages: 15
//     })
//   ).toBe(300);

//   expect(
//     durationLeft({
//       duration: 50,
//       startPage: 1,
//       currentPage: 5,
//       numberPages: 10
//     })
//   ).toBe(30);

//   expect(
//     durationLeft({
//       duration: 6,
//       startPage: 1,
//       currentPage: 2,
//       numberPages: 3
//     })
//   ).toBe(4);

//   expect(
//     durationLeft({
//       duration: 400,
//       startPage: 1,
//       currentPage: 1,
//       numberPages: 200
//     })
//   ).toBe(400);
// });
