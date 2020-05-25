import React, { lazy } from "react"
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
} from "../../graphQL/exams/queries"

// mutations ----------------
import { UPDATE_CURRENT_PAGE_MUTATION } from "../../graphQL/exams/mutations"

// react-bootstrap ----------------
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

// helpers ----------------
import { decodeHtml } from "../../helpers/general"

// components ----------------
const Button = lazy(() => import("../../components/button/Button"))
const Label = lazy(() => import("../../components/label/Label"))
const Input = lazy(() => import("../../components/input/Input"))
const Timeline = lazy(() => import("../../components/timeline/Timeline"))

function Today(props) {
  // form specific ----------------
  const { register, errors, handleSubmit, reset } = useForm()
  console.log(props)

  // user click to add custom page number ----------------
  const onSubmit = async (formData) => {
    try {
      // console.log("On submit")
      // console.log(formData.page_amount_studied, formData.cycles_studied)
      const chunk = props.selectedGoal
      const exam = chunk.exam
      const lastPage = exam.numberPages
      let cyclesStudied = parseInt(formData.cycles_studied)
      // const currentPage = exam.currentPage
      // let currentRepetion = Math.floor(currentPage / lastPage)
      let newPage =
        parseInt(formData.page_amount_studied) +
        lastPage * (cyclesStudied - 1) +
        1 // plus one to tell backend from which page to study next
      // console.log(newPage)

      // const numberPagesToday = chunk.numberPagesToday
      // const chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

      // update repetition cycle when entered number
      // is (lower than current page) OR (lower than goal AND higher than current page)
      // ex: goal 41 to 4
      // if (
      //   (newPage >= chunkGoalPage && newPage < currentPage) ||
      //   newPage < currentPage
      // ) {
      //   // update repetition cycle
      //   currentRepetion++
      //   newPage =
      //     parseInt(formData.page_amount_studied) +
      //     1 + // plus one to tell backend from which page to study next
      //     lastPage * currentRepetion
      // }

      // update page ----------------
      const resp = await updatePage({
        variables: {
          page: newPage,
          id: exam.id,
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
  const onSubmitAll = async (e) => {
    e.preventDefault()
    try {
      const resp = await updatePage({
        variables: {
          page:
            props.selectedGoal.numberPagesToday + props.selectedGoal.startPage,
          id: props.selectedGoal.exam.id,
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
  let lastPage = todaysChunk.exam.lastPage

  // start page for today's chunk goal ----------------
  let startPage = todaysChunk.exam.startPage

  // ----------------
  let repetitionCycles = todaysChunk.exam.timesRepeat
  let repetition = 1
  let repetitionCounter
  // if there is only 1 page to study
  // if (startPage === lastPage) {
  //   // get current repetition
  //   let currentRep = currentPage - startPage
  //   // backend returns start page + 1 for each cycle if only 1 page to study
  //   // ex: page to study = 5 in cycle 3:
  //   // ((7-2) * 1 = 10 / 5 = 2 + 1 = 3
  //   repetitionCounter = Math.round(
  //     ((currentPage - currentRep) * currentRep) / lastPage + 1
  //   )
  // } else {
  //   repetitionCounter = Math.floor(currentPage / lastPage) + 1
  // }
  // // check which cycle to display
  // if (repetitionCounter <= repetitionCycles) {
  //   repetition = repetitionCounter
  // } else {
  //   repetition = repetitionCycles
  // }

  repetition =
    Math.floor(
      (todaysChunk.exam.currentPage - todaysChunk.exam.startPage) /
        todaysChunk.exam.numberPages
    ) + 1
  // --------------------------------

  // real current page to display ----------------
  let realCurrentPage
  if (startPage === 1) {
    realCurrentPage = currentPage % lastPage
    // only 1 page to study
  } else if (startPage === lastPage) {
    realCurrentPage = currentPage % lastPage
    // consider start page in calculation
  } else {
    realCurrentPage =
      (currentPage % lastPage) +
      startPage * repetition -
      startPage -
      repetition +
      1
  }
  // to display the last page correctly (edge cases)
  if (realCurrentPage === 0) {
    realCurrentPage = lastPage
  }
  if (realCurrentPage < startPage) {
    realCurrentPage = startPage
  }
  if (realCurrentPage > lastPage) {
    realCurrentPage = startPage
  }
  // display for total no. of pages
  // let realCurrentPageTotal = currentPage % lastPage
  // if (realCurrentPageTotal === 0) {
  //   realCurrentPageTotal = lastPage
  // }
  // if (realCurrentPageTotal < startPage) {
  //   realCurrentPageTotal = startPage
  // }
  // if (realCurrentPageTotal === startPage) {
  //   realCurrentPageTotal = 1
  // }
  // if (realCurrentPageTotal > todaysChunk.numberPagesToday) {
  //   realCurrentPageTotal =
  //     realCurrentPageTotal - todaysChunk.numberPagesToday + 1
  // }
  // --------------------------------

  // last page for todays goal ----------------
  // let numberPages = todaysChunk.exam.numberPages
  // if start page is bigger than 1 -> last page minus start page (calculation from backend)
  // if (startPage > 1 && startPage != lastPage) {
  //   numberPages = todaysChunk.exam.numberPages
  // }
  // // if numberPagesToday is bigger than last page
  // // (happens when more than 1 cycle has to be studied in a day)
  // else if (
  //   todaysChunk.numberPagesToday > lastPage ||
  //   (todaysChunk.numberPagesToday >= lastPage && startPage === lastPage)
  // ) {
  //   numberPages =
  //     todaysChunk.numberPagesToday - startPage + todaysChunk.exam.timesRepeat
  // }
  // // happens if startPage = lastPage (only study 1 page)
  // else if (numberPages === 0) numberPages = lastPage - 1

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

  // days till deadline ----------------
  let daysLeft = todaysChunk.daysLeft
  // total days from start to end date
  let totalDays = todaysChunk.totalNumberDays
  // percentage for bar
  let dayPercentage = 100 - Math.round((daysLeft / totalDays) * 100)
  // --------------------------------

  // repetition goal to display next to goal ----------------
  // let repetitionGoal = Math.floor(currentPage / lastPage) + 1
  let repetitionGoal =
    Math.floor(
      (todaysChunk.startPage + todaysChunk.numberPagesToday - startPage - 1) /
        todaysChunk.exam.numberPages
    ) + 1
  // console.log(
  //   "chunk startpage: " +
  //     todaysChunk.startPage +
  //     ", chunk nr pages " +
  //     todaysChunk.numberPagesToday +
  //     ", total startpage " +
  //     startPage +
  //     ", exam nr pages (per cycle) " +
  //     todaysChunk.exam.numberPages
  // )
  // console.log(
  //   todaysChunk.startPage + todaysChunk.numberPagesToday - startPage - 1,
  //   todaysChunk.exam.numberPages
  // )
  // console.log(
  //   (todaysChunk.startPage + todaysChunk.numberPagesToday - startPage - 1) /
  //     todaysChunk.exam.numberPages
  // )
  // end page for today's chunk goal ----------------
  let numberPagesToday = todaysChunk.numberPagesToday + startPage - 1
  // if start page is bigger
  if (numberPagesToday < startPage && startPage !== lastPage) {
    // get pages for new cycles
    let pagesLeft = lastPage - todaysChunk.numberPagesToday
    // numberPagesToday = startPage + todaysChunk.numberPagesToday - pagesLeft
    // to display correct rep cycle goal
    // repetitionGoal =
    //   Math.round((startPage + numberPagesToday - pagesLeft) / lastPage) + 1
  }
  // only 1 page & multiple repetition cycles
  // if (
  //   (numberPagesToday > lastPage && realCurrentPage === lastPage) ||
  //   (numberPagesToday >= lastPage && startPage === lastPage)
  // ) {
  //here
  // let testRealCurrentPage =
  //   ((todaysChunk.exam.currentPage - todaysChunk.exam.startPage) %
  //     (todaysChunk.exam.lastPage - todaysChunk.exam.startPage + 1)) +
  //   todaysChunk.exam.startPage
  let realChunkStartPage =
    ((todaysChunk.startPage - todaysChunk.exam.startPage) %
      (todaysChunk.exam.lastPage - todaysChunk.exam.startPage + 1)) +
    todaysChunk.exam.startPage
  console.log("testREalChunkStartPage: " + realChunkStartPage)
  if (realChunkStartPage + numberPagesToday - 1 > lastPage) {
    console.log("HERE")
    console.log(realChunkStartPage, numberPagesToday, lastPage)
    console.log(realChunkStartPage + numberPagesToday - 1 > lastPage)
    // console.log(numberPagesToday > lastPage && realCurrentPage === lastPage)
    // console.log(numberPagesToday >= lastPage && startPage === lastPage)
    // // maximum goal is last page
    // numberPagesToday = lastPage

    // to display correct rep cycle goal
    // repetitionGoal = Math.floor(
    //   (todaysChunk.startPage + todaysChunk.numberPagesToday - startPage) /
    //     todaysChunk.exam.numberPages
    // )

    // show message
    noTimeMessage = "Info: You have to study multiple repetition cycles today"
  }
  // when numberPagesToday is bigger than lastPage, the user needs to study more than 1 repetition in a day
  if (numberPagesToday > lastPage) {
    // get pages for new cycles
    let pagesLeftInCycles = numberPagesToday - lastPage
    // maximum goal is last page
    numberPagesToday = lastPage
    // to display correct rep cycle goal
    // repetitionGoal = Math.round((startPage + pagesLeftInCycles) / lastPage) + 1
  }
  // if there is only 1 page to study
  // if (
  //   realCurrentPage === numberPagesToday &&
  //   repetition !== repetitionCycles &&
  //   todaysChunk.numberPagesToday === 1
  // ) {
  //   // to display correct rep cycle goal
  //   // repetitionGoal = repetition
  //   // to display correct total no. of pages if there is only 1 page
  //   // numberPages = 1
  //   // realCurrentPageTotal = 1
  // }
  // display message only if there is more than 1 cycle for 1 day
  // if (
  //   (numberPagesToday > lastPage && repetition !== repetitionCycles) ||
  //   (numberPagesToday === lastPage &&
  //     repetitionGoal > repetition &&
  //     todaysChunk.numberPagesToday !== 1 &&
  //     startPage !== lastPage)
  // ) {
  //   // to display correct rep cycle goal
  //   // repetitionGoal = repetitionCycles
  //   // show message
  //   noTimeMessage = "Info: You have to study multiple repetition cycles today"
  // }
  // --------------------------------

  // // real end page for today's chunk goal ----------------
  // let chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

  // // to display the last page correctly (edge cases)
  // if (chunkGoalPage === -1) {
  //   chunkGoalPage = lastPage
  // } else if (chunkGoalPage === 0) {
  //   chunkGoalPage = 1
  // }
  // --------------------------------

  // pages are left in total with repetition cycles ----------------
  let leftPagesTotal
  let leftPagesPercentage
  let currentPageBar

  // edge case start page is bigger than goal page
  // if (
  //   realCurrentPage > todaysChunk.numberPagesToday &&
  //   startPage !== lastPage
  // ) {
  // pages left
  // leftPagesTotal =
  //   numberPagesToday - (currentPage - todaysChunk.startPage) + 1
  leftPagesTotal =
    todaysChunk.numberPagesToday -
    (todaysChunk.exam.currentPage - todaysChunk.startPage)

  // percentage for bar
  currentPageBar = todaysChunk.numberPagesToday

  if (currentPageBar === 1 || currentPageBar === startPage) currentPageBar = 0 // to start with 0 in bar
  leftPagesPercentage =
    100 - Math.round((leftPagesTotal * 100) / currentPageBar)
  // }
  // // normal case
  // else if (
  //   todaysChunk.numberPagesToday <= lastPage &&
  //   realCurrentPage !== lastPage &&
  //   realCurrentPage < todaysChunk.numberPagesToday
  // ) {
  //   // pages left
  //   leftPagesTotal = numberPagesToday - realCurrentPage + 1

  //   // percentage for bar
  //   currentPageBar = realCurrentPage
  //   if (currentPageBar === 1 || currentPageBar === startPage) currentPageBar = 0 // to start with 0 in bar
  //   leftPagesPercentage = Math.round((currentPageBar * 100) / numberPages)
  // }
  // // if only 2 pages & NOT multiple cycles a day
  // else if (
  //   realCurrentPage > numberPages &&
  //   todaysChunk.numberPagesToday < numberPages
  // ) {
  //   leftPagesTotal = numberPages - realCurrentPageTotal + 1
  //   currentPageBar = realCurrentPage
  //   if (currentPageBar === 1 || currentPageBar === startPage) {
  //     leftPagesPercentage = 0 // to start with 0 in bar
  //   } else {
  //     leftPagesPercentage = Math.round(
  //       (realCurrentPageTotal * 100) / (lastPage - startPage + 1)
  //     )
  //   }
  // }
  // // if only 1 page
  // else if (realCurrentPage === lastPage) {
  //   leftPagesTotal = numberPages - realCurrentPageTotal + 1
  //   currentPageBar = realCurrentPage

  //   if (
  //     currentPageBar === 1 ||
  //     (currentPageBar === lastPage && repetitionGoal !== repetition)
  //   ) {
  //     leftPagesPercentage = 0 // to start with 0 in bar
  //   } else {
  //     leftPagesPercentage = Math.round(
  //       (realCurrentPageTotal * 100) / todaysChunk.numberPagesToday
  //     )
  //   }
  // }
  // // if only 2 pages & multiple cycles a day
  // else if (
  //   realCurrentPage > numberPages &&
  //   todaysChunk.numberPagesToday > numberPages
  // ) {
  //   if (realCurrentPageTotal === lastPage) {
  //     leftPagesTotal =
  //       todaysChunk.numberPagesToday - numberPages * repetition - 1
  //   } else {
  //     leftPagesTotal = todaysChunk.numberPagesToday - numberPages * repetition
  //   }
  //   // percentage for bar
  //   leftPagesPercentage = Math.round(
  //     (realCurrentPageTotal * 100) / (leftPagesTotal + 1)
  //   )
  // }
  // // if more than 1 cycle a day
  // else {
  //   // pages left
  //   leftPagesTotal = numberPages - realCurrentPageTotal + 1
  //   // percentage for bar
  //   leftPagesPercentage = Math.round(
  //     (100 / numberPages) * (currentPage - startPage + 1)
  //   )
  // }
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
                        {/* {console.log(
                          "(currentPage % lastPage) + startPage - 1",
                          todaysChunk.exam.currentPag,
                          todaysChunk.exam.lastPage,
                          todaysChunk.exam.startPage
                        )} */}
                        page{" "}
                        {((todaysChunk.exam.currentPage -
                          todaysChunk.exam.startPage) %
                          (todaysChunk.exam.lastPage -
                            todaysChunk.exam.startPage +
                            1)) +
                          todaysChunk.exam.startPage}{" "}
                        to {numberPagesToday} (rep. {repetitionGoal})
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
                      <div className="today-info-circle-container">
                        <p className="today__container__content__label">
                          {/* Total no. of pages: */}
                          {/* Page no. per cycle: */}
                          Page amount:
                        </p>
                        <p className="today__container__content__text">
                          {console.log(
                            todaysChunk.numberPagesToday,
                            todaysChunk.exam.currentPage,
                            todaysChunk.startPage
                          )}
                          {/*here*/}
                          {/** example: learn page 51-100, = 50 pages */}
                          {todaysChunk.exam.currentPage -
                            todaysChunk.startPage}{" "}
                          / {todaysChunk.numberPagesToday}
                          {/* {realCurrentPageTotal - 1} /{" "}
                          {todaysChunk.numberPagesToday} */}
                        </p>
                      </div>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip>
                            The amount of pages you have to study today
                          </Tooltip>
                        }
                      >
                        <span className="info-circle">i</span>
                      </OverlayTrigger>
                    </div>
                    <div className="today__container__content__details__total-pages">
                      <div className="today-info-circle-container">
                        <p className="today__container__content__label">
                          Total page nos.:
                        </p>
                        <p className="today__container__content__text">
                          {startPage} - {lastPage}
                        </p>
                      </div>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip>
                            The start and last page in your study materials
                          </Tooltip>
                        }
                      >
                        <span className="info-circle">i</span>
                      </OverlayTrigger>
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
                    styleChoice="bar"
                  ></Timeline>
                </div>
                {/* chunks left */}
                <div className="today__container__chunks-left">
                  <Timeline
                    heading="Pages left to study for today"
                    daysLeft={leftPagesTotal}
                    percentage={leftPagesPercentage}
                    styleChoice="bar"
                  ></Timeline>
                </div>

                {/* buttons */}
                <div className="today__container__buttons">
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
                            labelType="page"
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
                        <div className="today__container__buttons__submit__form__elements-container__elements">
                          <Label
                            labelType="cycle"
                            text="in repetition cycle:"
                            className="today__container__buttons__submit__form__elements-container__elements__label"
                          ></Label>
                          <Input
                            className="today__container__buttons__submit__form__elements-container__elements__input"
                            type="number"
                            min="0"
                            id="cycle"
                            label="cycles_studied"
                            placeholder={repetition}
                            ref={register({
                              required: true,
                              min: repetition,
                              max: repetitionCycles,
                            })}
                          />
                        </div>
                        {errors.cycles_studied &&
                          errors.cycles_studied.type === "required" && (
                            <span className="error">
                              Please enter a cycle number
                            </span>
                          )}
                        {errors.cycles_studied &&
                          errors.cycles_studied.type === "max" && (
                            <span className="error">
                              The maximum is your last cycle: {repetitionCycles}
                            </span>
                          )}
                        {errors.cycles_studied &&
                          errors.cycles_studied.type === "min" && (
                            <span className="error">
                              The minimum is your current cycle: {repetition}
                            </span>
                          )}
                      </div>

                      <Button
                        className="today__container__buttons__submit__form__btn stan-btn-secondary"
                        variant="button"
                        text="save"
                        type="submit"
                      />
                    </form>
                  </div>
                  <div className="today__container__buttons__submit-all">
                    {/* open notes or link */}
                    <Link
                      to={`/exams/${todaysChunk.exam.subject
                        .toLowerCase()
                        .replace(/ /g, "-")}?id=${todaysChunk.exam.id}`}
                      className="today__container__buttons__open"
                    >
                      open notes
                    </Link>

                    <form
                      onSubmit={onSubmitAll}
                      id="study-chunk-all"
                      className="today__container__buttons__submit-all__form-all"
                    >
                      {/* all done */}
                      <div className="today__container__buttons__submit-all__all-done">
                        <Button
                          className="today__container__buttons__submit-all__all-done__btn stan-btn-primary"
                          variant="button"
                          text="goal studied"
                          type="submit"
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
