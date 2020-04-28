import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
import { UPDATE_CURRENT_PAGE_MUTATION } from "../../graphQL/mutations"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
// --------------------------------------------------------------

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Timeline from "../../components/timeline/Timeline"

function Today(props) {
  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async formData => {}
  // mutation ----------------
  //   const [addChunkPages, { mutationData }] = useMutation(UPDATE_CURRENT_PAGE_MUTATION)

  // query ----------------
  const { loading, error } = useQuery(GET_USERS_QUERY)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // query data ----------------
  let deadline
  let subject
  let currentPage
  let realCurrentPage
  let chunkGoalPage
  let numberPagesToday
  let lastPage
  let amountPagesWithRepeat
  let repetition
  let repetitionCycles
  let duration
  let daysLeft
  let totalDays
  let dayPercentage
  let chunksTotal
  let chunkPercentage
  let noTime
  let noTimeMessage

  if (props.data && props.data.todaysChunks.length > 0) {
    noTime = props.data.todaysChunks[props.activeIndex].notEnoughTime
    if (noTime) {
      noTimeMessage =
        "Info: You need to study faster to finish all pages until the exam!"
    }

    subject = props.data.todaysChunks[props.activeIndex].exam.subject

    deadline = props.data.todaysChunks[props.activeIndex].exam.examDate.slice(
      0,
      10
    )
    deadline = deadline
      .split("-")
      .reverse()
      .join("-")
      .replace("-", "/")
      .replace("-", "/")

    currentPage = props.data.todaysChunks[props.activeIndex].exam.currentPage
    amountPagesWithRepeat =
      props.data.todaysChunks[props.activeIndex].numberPagesWithRepeat
    lastPage = props.data.todaysChunks[props.activeIndex].exam.numberPages
    realCurrentPage = currentPage % lastPage

    numberPagesToday =
      props.data.todaysChunks[props.activeIndex].numberPagesToday
    chunkGoalPage = ((currentPage + numberPagesToday) % lastPage) - 1

    duration = props.data.todaysChunks[props.activeIndex].duration

    repetitionCycles =
      props.data.todaysChunks[props.activeIndex].exam.timesRepeat
    repetition = 1
    let repetitionCounter = Math.floor(currentPage / lastPage) + 1
    if (repetitionCounter <= repetitionCycles) {
      repetition = repetitionCounter
    } else {
      repetition = repetitionCycles
    }

    daysLeft = props.data.todaysChunks[props.activeIndex].daysLeft
    totalDays = props.data.todaysChunks[props.activeIndex].totalNumberDays
    dayPercentage = 100 - Math.round((daysLeft / totalDays) * 100)

    chunksTotal = totalDays
    chunkPercentage = 100 - Math.round((daysLeft / chunksTotal) * 100)
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
                        {duration} min
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
                    heading="Chunks left to study"
                    daysLeft={daysLeft}
                    percentage={chunkPercentage}
                    style="chunks"
                  ></Timeline>
                </div>

                {/* buttons */}
                <div className="today__container__buttons">
                  {/* open notes or link */}
                  {/* TODO: add link to exam */}
                  <Link to="/exams" className="today__container__buttons__open">
                    open notes
                  </Link>

                  <div className="today__container__buttons__submit">
                    {/* pages done */}
                    <form
                      // onSubmit={handleSubmit}
                      onSubmit={handleSubmit(onSubmit)}
                      id="study-chunk"
                      className="today__container__buttons__submit__form"
                    >
                      <div className="today__container__buttons__submit__form__elements">
                        <Label
                          for="page-amount-studied"
                          text="studied up to page:"
                          className="today__container__buttons__submit__form__elements__label"
                        ></Label>
                        <Input
                          className="today__container__buttons__submit__form__elements__input"
                          type="number"
                          min="0"
                          id="page-amount-studied"
                          label="page_amount_studied"
                          placeholder={realCurrentPage}
                          ref={register({
                            min: 1,
                            max: { amountPagesWithRepeat },
                          })}
                        />
                        {errors.page_amount_studied &&
                          errors.page_amount_studied.type === "max" && (
                            <span className="error">The maximum is 10.000</span>
                          )}
                        {errors.page_amount_studied &&
                          errors.page_amount_studied.type === "min" && (
                            <span className="error">
                              Only positive numbers are allowed
                            </span>
                          )}
                      </div>
                      <Button
                        className="today__container__buttons__submit__form__btn stan-btn-secondary"
                        variant="button"
                        text="save"
                      />
                    </form>
                    {/* all done */}
                    <div className="today__container__buttons__submit__all-done">
                      <Button
                        className="today__container__buttons__submit__all-done__btn stan-btn-primary"
                        variant="button"
                        text="goal studied"
                      />
                    </div>
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
