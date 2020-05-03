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
// --------------------------------------------------------------

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Timeline from "../../components/timeline/Timeline"

function Today(props) {
  // form specific ----------------
  const { register, errors, handleSubmit, reset } = useForm()

  let pagesStudiedForm

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

  // mutation ----------------
  const [updatePage] = useMutation(UPDATE_CURRENT_PAGE_MUTATION)

  // query data ----------------
  let deadline
  let subject
  let currentPage
  let realCurrentPage
  let chunkGoalPage
  let numberPagesToday
  let lastPage
  let startPage
  let amountPagesWithRepeat
  let repetition
  let repetitionCycles
  let repetitionCounter
  let duration
  let durationTime
  let hours
  let minutes
  let daysLeft
  let totalDays
  let dayPercentage
  let chunksTotal
  let chunkPercentage
  let noTime
  let noTimeMessage

  if (props.data && props.data.todaysChunkAndProgress.todaysChunks.length > 0) {
    subject =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].exam
        .subject

    deadline = props.data.todaysChunkAndProgress.todaysChunks[
      props.activeIndex
    ].exam.examDate.slice(0, 10)
    deadline = deadline
      .split("-")
      .reverse()
      .join("/")

    currentPage =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].exam
        .currentPage
    amountPagesWithRepeat =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
        .numberPagesWithRepeat
    lastPage =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].exam
        .numberPages
    realCurrentPage = currentPage % lastPage

    startPage =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
        .startPage

    numberPagesToday =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
        .numberPagesToday

    chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

    // to display last page correctly
    if (chunkGoalPage == -1) {
      chunkGoalPage = lastPage
    } else if (chunkGoalPage == 0) {
      chunkGoalPage = 1
    }

    duration =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
        .durationToday
    if (duration >= 60) {
      hours = Math.floor(duration / 60)
      minutes = Math.floor(duration) - hours * 60
      durationTime = hours + " hours " + minutes + " min"
    } else {
      minutes = duration
      durationTime = minutes + " min"
    }

    // noTime = props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].notEnoughTime
    if (duration > 1440) {
      noTimeMessage =
        "Info: You need to study faster to finish all pages until the exam!"
    }

    repetitionCycles =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].exam
        .timesRepeat
    repetition = 1
    repetitionCounter = Math.floor(currentPage / lastPage) + 1
    if (repetitionCounter <= repetitionCycles) {
      repetition = repetitionCounter
    } else {
      repetition = repetitionCycles
    }

    daysLeft =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex].daysLeft
    totalDays =
      props.data.todaysChunkAndProgress.todaysChunks[props.activeIndex]
        .totalNumberDays
    dayPercentage = 100 - Math.round((daysLeft / totalDays) * 100)

    // calculation for chunks
    // chunksTotal = totalDays
    // chunkPercentage = 100 - Math.round((daysLeft / chunksTotal) * 100)

    // calculation for how many pages are left
    chunksTotal = lastPage * (repetitionCycles + 1) - currentPage
    chunkPercentage = Math.round((lastPage / chunksTotal) * 100)
  }

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
                        page {realCurrentPage} to {chunkGoalPage}
                      </p>
                    </div>
                    <div className="today__container__content__details__duration">
                      <p className="today__container__content__label">
                        Duration:
                      </p>
                      <p className="today__container__content__text">
                        {durationTime}
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
                    heading="Pages left to study"
                    daysLeft={chunksTotal}
                    percentage={chunkPercentage}
                    style="chunks"
                  ></Timeline>
                </div>

                {/* buttons */}
                <div className="today__container__buttons">
                  {/* open notes or link */}
                  <Link
                    to={`/exams/${props.data.todaysChunkAndProgress.todaysChunks[
                      props.activeIndex
                    ].exam.subject
                      .toLowerCase()
                      .replace(/ /g, "-")}?id=${
                      props.data.todaysChunkAndProgress.todaysChunks[
                        props.activeIndex
                      ].exam.id
                    }`}
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
