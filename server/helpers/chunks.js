export function numberOfPagesForChunk({
  numberOfPages,
  currentPage,
  daysLeft
}) {
  console.log("args:");
  console.log("numpages: " + numberOfPages);
  console.log("currentpage: " + currentPage);
  console.log("daysleft: " + daysLeft);
  if (isNaN(numberOfPages) || isNaN(currentPage) || isNaN(daysLeft))
    throw new Error("Not all arguments for numberOfPagesForChunk are numbers");
  let pagesLeft = numberOfPages - currentPage + 1;
  console.log("pagesleft: " + pagesLeft);
  console.log("chunk pages: " + Math.round(pagesLeft / daysLeft) + "\n");
  return Math.round(pagesLeft / daysLeft);
}
