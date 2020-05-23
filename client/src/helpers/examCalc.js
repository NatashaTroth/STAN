export const calcExamProgress = exam => {
  /**
   * nr pages * repeat....100%
   * currentPage - startPage (as if startpage = 0)...x
   */
  const currentPageWithoutStartpage = exam.currentPage - exam.startPage
  const totalNumberPages = exam.numberPages * exam.timesRepeat
  if (totalNumberPages === 0) return 0 //to avoid division by 0 which would return infinity
  const examProgress = Math.round(
    (100 * currentPageWithoutStartpage) / totalNumberPages
  )
  return examProgress
}

export const currentRepetition = examDetails => {
  const rep = Math.floor(
    (examDetails.currentPage - examDetails.startPage) /
      examDetails.numberPages +
      1
  )

  if (rep < 1) rep = 1

  return rep
}

export const calcProgressbar = examDetails => {
  const progressbar = Math.round(
    (100 * (examDetails.currentPage - examDetails.startPage)) /
      (examDetails.numberPages * examDetails.timesRepeat)
  )

  if (progressbar > 100) progressbar = 100

  return progressbar
}

export const getCurrentPage = (examDetails, currentRep) => {
  let currentPageWithoutStartPage =
    examDetails.currentPage - examDetails.startPage
  let numberPagesLearned = examDetails.numberPages * (currentRep - 1)

  return (
    currentPageWithoutStartPage - numberPagesLearned + examDetails.startPage
  )
}

export const pagesLeft = examDetails => {
  const pagesLeft =
    examDetails.numberPages * examDetails.timesRepeat -
    (examDetails.currentPage + 1 - examDetails.startPage)
  return pagesLeft
}
