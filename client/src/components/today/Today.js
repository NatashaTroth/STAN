import React from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import {
  GET_EXAMS_QUERY,
  GET_TODAYS_CHUNKS_AND_PROGRESS,
  GET_CALENDAR_CHUNKS,
} from "../../graphQL/queries"
import { UPDATE_CURRENT_PAGE_MUTATION } from "../../graphQL/mutations"
import { useForm } from "react-hook-form"
import { Link, useRouteMatch } from "react-router-dom"
import moment from "moment"
import { calculateDuration } from "../today-goals/TodayGoals"
// --------------------------------------------------------------

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Timeline from "../../components/timeline/Timeline"

function Today(props) {
  // form specific ----------------
  const { register, errors, handleSubmit, reset } = useForm()

  // mutation data ----------------
  let pagesStudiedForm

  // user click to add custom page number ----------------
  const onSubmit = async formData => {
    try {
      if (
        (parseInt(formData.page_amount_studied) >= chunkGoalPage &&
          parseInt(formData.page_amount_studied) < realCurrentPage) ||
        parseInt(formData.page_amount_studied) < realCurrentPage
      ) {
        repetition++
      }

      if (repetition == 1) {
        pagesStudiedForm = parseInt(formData.page_amount_studied) + 1
      } else {
        // (total pages * cycle) + current page in cycle + 1
        pagesStudiedForm =
          lastPage * (repetition - 1) +
          parseInt(formData.page_amount_studied) +
          1
      }

      const resp = await updatePage({
        variables: {
          page: parseInt(pagesStudiedForm),
          examId:
            props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
              .exam.id,
        },
        refetchQueries: [
          { query: GET_EXAMS_QUERY },
          { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
          { query: GET_CALENDAR_CHUNKS },
        ],
      })

      reset({}) // reset form data
    } catch (err) {
      // TODO: display error message
      console.error(err.message)
    }
  }

  // user click on goal-studied ----------------
  const onSubmitAll = async formData => {
    try {
      const resp = await updatePage({
        variables: {
          page: chunkGoalPage + 1,
          examId:
            props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
              .exam.id,
        },
        refetchQueries: [
          { query: GET_EXAMS_QUERY },
          { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
          { query: GET_CALENDAR_CHUNKS },
        ],
      })
    } catch (err) {
      // TODO: display error message
      console.error(err.message)
    }
  }
  // ------------------------------------------------------------------------------------------------
  // mutation ----------------
  const [updatePage] = useMutation(UPDATE_CURRENT_PAGE_MUTATION)

  // check if there is data ----------------
  if (
    props.data &&
    props.data.todaysChunkAndProgress.todaysChunks.length === 0
  ) {
    return null
  }

  // load todaysChunk ----------------
  let todaysChunk =
    props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]

  // subject ----------------
  let subject = todaysChunk.exam.subject

  // deadline ----------------
  let deadline = moment(todaysChunk.exam.examDate).format("DD/MM/YYYY")

  // current page total (total pages + real current page) ----------------
  // ex: total 30, real current: 4, current: 34
  let currentPage = todaysChunk.exam.currentPage

  // last page to study ----------------
  let lastPage = todaysChunk.exam.numberPages

  // real current page to display ----------------
  let realCurrentPage = currentPage % lastPage

  // start page for today's chunk goal ----------------
  let startPage = todaysChunk.startPage

  // end page for today's chunk goal ----------------
  let numberPagesToday = todaysChunk.numberPagesToday

  // real end page for today's chunk goal ----------------
  let chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

  // to display the last page correctly (edge cases)
  if (chunkGoalPage == -1) {
    chunkGoalPage = lastPage
  } else if (chunkGoalPage == 0) {
    chunkGoalPage = 1
  }
  // --------------------------------

  // duration ----------------
  let duration = todaysChunk.durationLeftToday
  let durationFormatted = calculateDuration(duration)

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

  // pages are left in total with repetition cycles ----------------
  let leftPagesTotal = lastPage * repetitionCycles - currentPage + 1
  // percentage for bar
  let leftPagesPercentage = Math.round(
    (currentPage * 100) / (leftPagesTotal + lastPage)
  )
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
                      {subject}
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
                        page {realCurrentPage} to{" "}
                        {startPage + numberPagesToday - 1}
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
                        Total pages:
                      </p>
                      <p className="today__container__content__text">
                        {realCurrentPage} / {lastPage}
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
                              min: realCurrentPage,
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
                            The maximum is your last page: {lastPage}
                          </span>
                        )}
                      {errors.page_amount_studied &&
                        errors.page_amount_studied.type === "min" && (
                          <span className="error">
                            The minimum page is today's start page
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
