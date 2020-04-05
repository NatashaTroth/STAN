export function numberOfPagesForChunk({
  numberOfPages,
  currentPage,
  daysLeft,
  repeat
}) {
  if (isNaN(numberOfPages) || isNaN(currentPage) || isNaN(daysLeft))
    throw new Error("Not all arguments for numberOfPagesForChunk are numbers");
  let pagesLeft = numberOfPages * repeat - currentPage + 1;

  return Math.round(pagesLeft / daysLeft);
}
