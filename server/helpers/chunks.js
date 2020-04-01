export function numberOfPagesForChunk(numberOfPages, currentPage, daysLeft) {
  let pagesLeft = numberOfPages - currentPage + 1;
  return pagesLeft / daysLeft;
}
