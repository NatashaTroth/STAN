export const currentMood = currentState => {
  let mood

  if (currentState >= 0 && currentState <= 19) mood = "very stressed"
  else if (currentState >= 20 && currentState <= 49) mood = "stressed"
  else if (currentState >= 50 && currentState <= 69) mood = "okay"
  else if (currentState >= 70 && currentState <= 89) mood = "happy"
  else if (currentState >= 90 && currentState <= 100) mood = "very happy"

  return mood
}

export const extractDomain = url => {
  var domain

  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2]
  } else {
    domain = url.split("/")[0]
  }

  if (domain.indexOf("www.") > -1) {
    domain = domain.split("www.")[1]
  }

  domain = domain.split(":")[0]
  domain = domain.split("?")[0]

  return domain
}

export const filteredLinks = array => {
  const links = array.filter(function(el) {
    return el !== ""
  })

  return links
}

export const decodeHtml = html => {
  let txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

export const calcExamProgress = exam => {
  /**
   * nr pages * repeat....100%
   * currentPage - startPage (as if startpage = 0)...x
   */
  const currentPageWithoutStartpage = exam.currentPage - exam.startPage
  const totalNumberPages = (exam.lastPage - exam.startPage) * exam.timesRepeat
  if (totalNumberPages === 0) return 0 //to avoid division by 0 which would return infinity
  const examProgress = Math.round(
    (100 * currentPageWithoutStartpage) / totalNumberPages
  )
  return examProgress
}
