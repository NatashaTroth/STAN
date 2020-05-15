import React from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import moment from "moment"
import { minuteToHours } from "../../helpers/dates"
// --------------------------------------------------------------

// queries ----------------
import { useMutation } from "@apollo/react-hooks"
import {
  GET_EXAMS_QUERY,
  GET_TODAYS_CHUNKS_AND_PROGRESS,
  GET_CALENDAR_CHUNKS,
} from "../../graphQL/queries"

// mutations ----------------
import { UPDATE_CURRENT_PAGE_MUTATION } from "../../graphQL/mutations"

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Timeline from "../../components/timeline/Timeline"

// helpers ----------------
import { decodeHtml } from "../../helpers/mascots"

function Today(props) {
  // form specific ----------------
  const { register, errors, handleSubmit, reset } = useForm()

  // user click to add custom page number ----------------
  const onSubmit = async formData => {
    try {
      const chunk = props.selectedGoal
      const exam = chunk.exam
      const currentPage = exam.currentPage
      const lastPage = exam.numberPages
      let currentRepetion = Math.floor(currentPage / lastPage)
      let newPage =
        parseInt(formData.page_amount_studied) +
        1 + // plus one to tell backend from which page to study next
        lastPage * currentRepetion
      const numberPagesToday = chunk.numberPagesToday
      const chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

      // update repetition cycle when entered number
      // is (lower than current page) OR (lower than goal AND higher than current page)
      // ex: goal 41 to 4
      if (
        (newPage >= chunkGoalPage && newPage < currentPage) ||
        newPage < currentPage
      ) {
        // update repetition cycle
        currentRepetion++
        newPage =
          parseInt(formData.page_amount_studied) +
          1 + // plus one to tell backend from which page to study next
          lastPage * currentRepetion
      }

      // update page ----------------
      const resp = await updatePage({
        variables: {
          page: newPage,
          examId: exam.id,
        },
        refetchQueries: [
          { query: GET_EXAMS_QUERY },
          { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
          { query: GET_CALENDAR_CHUNKS },
        ],
      })

      if (resp && resp.data && resp.data.updateCurrentPage) {
        reset({}) // reset form data
      } else {
        throw new Error(
          "Unable to update study progress, please check your input"
        )
      }
    } catch (err) {
      let element = document.getElementsByClassName("graphql-error")

      if (err.graphQLErrors && err.graphQLErrors[0]) {
        element[0].innerHTML = err.graphQLErrors[0].message
      } else {
        element[0].innerHTML = err.message
      }
    }
  }

  // user click on goal-studied ----------------
  const onSubmitAll = async e => {
    e.preventDefault()
    try {
      const resp = await updatePage({
        variables: {
          page:
            props.selectedGoal.numberPagesToday + props.selectedGoal.startPage,
          examId: props.selectedGoal.exam.id,
        },
        refetchQueries: [
          { query: GET_EXAMS_QUERY },
          { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
          { query: GET_CALENDAR_CHUNKS },
        ],
      })

      if (resp && resp.data && resp.data.updateCurrentPage) {
      } else {
        throw new Error("Unable to update study progress")
      }
    } catch (err) {
      let element = document.getElementsByClassName("graphql-error")

      if (err.graphQLErrors && err.graphQLErrors[0]) {
        element[0].innerHTML = err.graphQLErrors[0].message
      } else {
        element[0].innerHTML = err.message
      }
    }
  }
  // ------------------------------------------------------------------------------------------------
  // mutation ----------------
  const [updatePage] = useMutation(UPDATE_CURRENT_PAGE_MUTATION)

  // load todaysChunk ----------------
  let todaysChunk = props.selectedGoal

  // subject ----------------
  let subject = todaysChunk.exam.subject

  // deadline ----------------
  let deadline = moment(todaysChunk.exam.examDate).format("DD/MM/YYYY")

  // current page total (total pages + real current page) ----------------
  // ex: total 30, real current: 4, current: 34
  let currentPage = todaysChunk.exam.currentPage

  // last page to study ----------------
  let lastPage = todaysChunk.exam.numberPages

  // start page for today's chunk goal ----------------
  let startPage = todaysChunk.startPage

  // real current page to display ----------------
  let realCurrentPage = currentPage % lastPage
  // to display the last page correctly (edge cases)
  if (realCurrentPage == 0) {
    realCurrentPage = lastPage
  }
  if (realCurrentPage < startPage) {
    realCurrentPage = startPage
  }
  // display for total no. of pages
  let realCurrentPageTotal = currentPage % lastPage
  if (realCurrentPageTotal == 0) {
    realCurrentPageTotal = lastPage
  }
  if (realCurrentPageTotal < startPage) {
    realCurrentPageTotal = startPage
  }
  // --------------------------------

  // last page for todays goal ----------------
  let totalPages
  // if start page is bigger than 1 -> last page minus start page
  if (startPage > 1) {
    totalPages = lastPage - startPage
  } else {
    totalPages = lastPage
  }
  // if numberPagesToday is bigger than last page
  // (happens when more than 1 cycle has to be studied in a day)
  if (todaysChunk.numberPagesToday > lastPage) {
    totalPages = todaysChunk.numberPagesToday - startPage
  }
  // happens if startPage = lastPage (only study 1 page)
  if (totalPages == 0) totalPages = lastPage - 1

  // duration ----------------
  let duration = todaysChunk.durationLeftToday
  let durationFormatted = minuteToHours(duration)

  // alert no time left ----------------
  let noTimeMessage
  // noTime = todaysChunk.notEnoughTime
  if (duration > 1440) {
    noTimeMessage =
      "Info: You need to study faster to finish all pages until the exam!"
  }
  // --------------------------------

  // ----------------
  let repetitionCycles = todaysChunk.exam.timesRepeat
  let repetition = 1
  let repetitionCounter = Math.floor(currentPage / lastPage) + 1
  if (repetitionCounter <= repetitionCycles) {
    repetition = repetitionCounter
  } else {
    repetition = repetitionCycles
  }
  // days till deadline ----------------
  let daysLeft = todaysChunk.daysLeft
  // total days from start to end date
  let totalDays = todaysChunk.totalNumberDays
  // percentage for bar
  let dayPercentage = 100 - Math.round((daysLeft / totalDays) * 100)
  // --------------------------------

  // repetition goal to display next to goal ----------------
  let repetitionGoal = 1

  // end page for today's chunk goal ----------------
  let numberPagesToday = todaysChunk.numberPagesToday
  // if start page is bigger
  if (numberPagesToday < startPage) {
    numberPagesToday = startPage + numberPagesToday
  }
  // when numberPagesToday is bigger than lastPage, the user needs to study more than 1 repetition in a day
  if (numberPagesToday > lastPage) {
    // get pages for new cycles
    let pagesLeftInCycles = numberPagesToday - lastPage
    // maximum goal is last page
    numberPagesToday = lastPage

    repetitionGoal = Math.floor(pagesLeftInCycles / lastPage) + 1

    // show message
    noTimeMessage = "Info: You have to study multiple repetition cycles today"
  }
  // if there is only 1 page to study
  if (realCurrentPage == numberPagesToday) {
    // to display correct rep cycle goal
    repetitionGoal = repetition
    // to display correct total no. of pages if there is only 1 page
    totalPages = 1
    realCurrentPageTotal = 1
  }
  // --------------------------------

  // real end page for today's chunk goal ----------------
  let chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

  // to display the last page correctly (edge cases)
  if (chunkGoalPage == -1) {
    chunkGoalPage = lastPage
  } else if (chunkGoalPage == 0) {
    chunkGoalPage = 1
  }
  // --------------------------------

  // pages are left in total with repetition cycles ----------------
  let leftPagesTotal
  let leftPagesPercentage
  let currentPageBar

  if (todaysChunk.numberPagesToday <= lastPage) {
    // pages left
    leftPagesTotal = lastPage - currentPage + startPage
    // percentage for bar
    currentPageBar = currentPage
    if (currentPageBar == 1 || currentPageBar == startPage) currentPageBar = 0 // to start with 0 in bar
    leftPagesPercentage = Math.round((currentPageBar * 100) / lastPage)

    // when you have to study multiple repetition cycles a day
  } else {
    // pages left
    leftPagesTotal = lastPage * repetitionCycles - currentPage + 1 + startPage
    // percentage for bar
    currentPageBar = currentPage
    if (currentPageBar == 1 || currentPageBar == startPage) currentPageBar = 0 // to start with 0 in bar
    leftPagesPercentage = Math.round(
      (currentPage * 100) / (leftPagesTotal + lastPage)
    )
  }
  // --------------------------------

  // return ----------------
  return (
    <div className="today box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="today__container">
              <div className="today__container__header">
                <h3 className="today__container__header__heading">Today</h3>
                <div className="today__container__header__deadline">
                  <p className="today__container__header__deadline__text">
                    deadline
                  </p>
                  <p className="today__container__header__deadline__date">
                    {deadline}
                  </p>
                </div>
              </div>
              <div className="today__container__content">
                <div className="today__container__content__layout">
                  <div className="today__container__content__subject">
                    <p className="today__container__content__label">Subject</p>
                    <p className="today__container__content__text--big">
                      {decodeHtml(subject)}
                    </p>
                  </div>
                  <div className="today__container__content__warning">
                    <p className="today__container__content__text--warning">
                      {noTimeMessage}
                    </p>
                  </div>
                </div>
                <div className="today__container__content__layout">
                  <div className="today__container__content__details">
                    <div className="today__container__content__details__goal">
                      <p className="today__container__content__label">Goal:</p>
                      <p className="today__container__content__text">
                        page {realCurrentPage} to {numberPagesToday} (rep.{" "}
                        {repetitionGoal})
                      </p>
                    </div>
                    <div className="today__container__content__details__duration">
                      <p className="today__container__content__label">
                        Duration:
                      </p>
                      <p className="today__container__content__text">
                        {durationFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="today__container__content__details">
                    <div className="today__container__content__details__total-pages">
                      <p className="today__container__content__label">
                        Total no. of pages:
                      </p>
                      <p className="today__container__content__text">
                        {realCurrentPageTotal} / {totalPages}
                      </p>
                    </div>
                    <div className="today__container__content__details__total-pages">
                      <p className="today__container__content__label">
                        Page numbers:
                      </p>
                      <p className="today__container__content__text">
                        {startPage} - {lastPage}
                      </p>
                    </div>
                    <div className="today__container__content__details__repetition">
                      <p className="today__container__content__label">
                        Repetition cycle:
                      </p>
                      <p className="today__container__content__text">
                        {repetition} / {repetitionCycles}
                      </p>
                    </div>
                  </div>
                </div>
                {/* days left */}
                <div className="today__container__days-left">
                  <Timeline
                    heading="Days until deadline"
                    daysLeft={daysLeft}
                    percentage={dayPercentage}
                    style="bar"
                  ></Timeline>
                </div>
                {/* chunks left */}
                <div className="today__container__chunks-left">
                  <Timeline
                    heading="Study Progress (pages)"
                    daysLeft={leftPagesTotal}
                    percentage={leftPagesPercentage}
                    style="bar"
                  ></Timeline>
                </div>

                {/* buttons */}
                <div className="today__container__buttons">
                  {/* open notes or link */}
                  <Link
                    to={`/exams/${todaysChunk.exam.subject
                      .toLowerCase()
                      .replace(/ /g, "-")}?id=${todaysChunk.exam.id}`}
                    className="today__container__buttons__open"
                  >
                    open notes
                  </Link>

                  <div className="today__container__buttons__submit">
                    {/* pages done */}
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      id="study-chunk"
                      className="today__container__buttons__submit__form"
                    >
                      <div className="today__container__buttons__submit__form__elements-container">
                        <div className="today__container__buttons__submit__form__elements-container__elements">
                          <Label
                            for="page"
                            text="studied up to page:"
                            className="today__container__buttons__submit__form__elements-container__elements__label"
                          ></Label>
                          <Input
                            className="today__container__buttons__submit__form__elements-container__elements__input"
                            type="number"
                            min="0"
                            id="page"
                            label="page_amount_studied"
                            placeholder={realCurrentPage}
                            ref={register({
                              required: true,
                              min: startPage,
                              max: lastPage,
                            })}
                          />
                        </div>
                        <Button
                          className="today__container__buttons__submit__form__btn stan-btn-secondary"
                          variant="button"
                          text="save"
                        />
                      </div>
                      {errors.page_amount_studied &&
                        errors.page_amount_studied.type === "required" && (
                          <span className="error">
                            Please enter a page number
                          </span>
                        )}
                      {errors.page_amount_studied &&
                        errors.page_amount_studied.type === "max" && (
                          <span className="error">
                            The maximum is your study materials last page:{" "}
                            {lastPage}
                          </span>
                        )}
                      {errors.page_amount_studied &&
                        errors.page_amount_studied.type === "min" && (
                          <span className="error">
                            The minimum page your study materials start page:{" "}
                            {startPage}
                          </span>
                        )}
                    </form>
                    <form
                      onSubmit={onSubmitAll}
                      id="study-chunk-all"
                      className="today__container__buttons__submit__form-all"
                    >
                      {/* all done */}
                      <div className="today__container__buttons__submit__all-done">
                        <Button
                          className="today__container__buttons__submit__all-done__btn stan-btn-primary"
                          variant="button"
                          text="goal studied"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div>
                  <p className="error graphql-error"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
