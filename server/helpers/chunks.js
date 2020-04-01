export function numberOfPagesForChunk(numberOfPages, currentPage, daysLeft) {
  console.log("args:");
  console.log(numberOfPages);
  console.log(currentPage);
  console.log(daysLeft);
  let pagesLeft = numberOfPages - currentPage + 1;
  console.log(pagesLeft);
  return pagesLeft / daysLeft;
}
