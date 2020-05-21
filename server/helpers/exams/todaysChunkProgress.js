import {
  learningIsComplete
  // handleCurrentPageInput
} from "./examHelpers";
import { fetchTodaysChunks } from "./chunks";

// export async function getTodaysChunkProgress(userId) {
//   //TODO: INDEX userid
//   const todaysChunks = await fetchTodaysChunks(userId);
//   return calculateChunkProgress(todaysChunks);
// }

export function calculateChunkProgress(chunks) {
  if (chunks.length <= 0) return 100;
  let totalDuration = 0;
  let totalDurationCompleted = 0;
  chunks.forEach(chunk => {
    //INDEX USERID FOR TODAYSCHUNKS AND EXAMID FOR EXAMSs

    let durationAlreadyLearned = chunk.durationAlreadyLearned || 0;
    totalDuration += chunk.durationToday + durationAlreadyLearned;

    totalDurationCompleted +=
      durationCompleted({
        duration: chunk.durationToday,
        startPage: chunk.startPage,
        currentPage: chunk.currentPage,
        numberPages: chunk.numberPagesToday,
        completed: chunk.completed
      }) + durationAlreadyLearned;
  });

  //duration ..... 100%
  //duration completed ... x
  if (totalDuration === 0) return 0;
  let progress = Math.round((100 / totalDuration) * totalDurationCompleted);
  if (progress < 0) progress = 0;
  // console.log("PROGRESS: " + progress);
  return progress;
}

export function durationCompleted({ duration, startPage, currentPage, numberPages, completed }) {
  if (completed || learningIsComplete(currentPage, startPage, numberPages, 1)) return duration;
  const timePerPage = duration / numberPages;
  const numberOfpagesCompleted = currentPage - startPage;
  return numberOfpagesCompleted * timePerPage;
}
