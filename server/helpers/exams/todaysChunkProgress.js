import { learningIsComplete } from "./examHelpers";

export function calculateChunkProgress(chunks) {
  if (chunks.length <= 0) return 100;
  let totalDuration = 0;
  let totalDurationCompleted = 0;
  chunks.forEach(chunk => {
    console.log(chunk);
    totalDuration += chunk.durationToday;
    console.log(totalDuration);
    totalDurationCompleted += durationCompleted({
      duration: chunk.durationToday,
      startPage: chunk.startPage,
      currentPage: chunk.currentPage,
      numberPages: chunk.numberPagesToday,
      completed: chunk.completed
    });
    console.log(totalDurationCompleted);
  });
  //duration ..... 100%
  //duration completed ... x
  if (totalDuration === 0) return 0;
  let progress = Math.floor((100 / totalDuration) * totalDurationCompleted);
  if (progress < 0) progress = 0;
  console.log(progress);
  return progress;
}

export function durationCompleted({ duration, startPage, currentPage, numberPages, completed }) {
  console.log("dur com: ", duration, startPage, currentPage, numberPages, completed);
  if (completed || learningIsComplete(currentPage, startPage, numberPages, 1)) return duration;
  console.log(learningIsComplete(currentPage, startPage, numberPages, 1));
  const timePerPage = duration / numberPages;
  console.log(timePerPage);
  const numberOfPagesCompleted = currentPage - startPage;
  console.log(numberOfPagesCompleted);

  return numberOfPagesCompleted * timePerPage;
}
