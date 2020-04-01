import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// components ----------------
import Button from "../../components/button/Button"
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Timeline from "../../components/timeline/Timeline"

function Today() {
  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async formData => {
    // try {
    //   console.log(JSON.stringify(formData.exam_date))
    //   const resp = await addChunkPages({
    //     variables: {
    //       numberPages: parseInt(formData.page_amount_studied),
    //       userId: data.currentUser.id,
    //     },
    //     refetchQueries: [{ query: GET_EXAMS_QUERY }],
    //   })
    //   if (resp && resp.data && resp.data.addChunkPages) {
    //     // TODO: remove block from dashboard
    //   } else {
    //     // displays server error (backend)
    //     throw new Error("Your input could not be saved")
    //   }
    // } catch (err) {
    //   console.error(err.message)
    // }
  }

  // query ----------------
  const { loading, error } = useQuery(GET_USERS_QUERY)

  // mutation ----------------
  //   const [addChunkPages, { mutationData }] = useMutation(ADD_EXAM_MUTATION)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

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
                  {/* TODO: insert deadline */}
                  <p className="today__container__header__deadline__date">
                    30/01/2020
                  </p>
                </div>
              </div>
              <div className="today__container__content">
                <div className="today__container__content__layout">
                  <div className="today__container__content__subject">
                    <p className="today__container__content__label">Subject</p>
                    <p className="today__container__content__text--big">
                      Computer Networks
                    </p>
                  </div>
                  <div className="today__container__content__warning">
                    <p className="today__container__content__text--warning">
                      Info: You need to study faster to finish all pages until
                      the exam!
                    </p>
                  </div>
                </div>
                <div className="today__container__content__layout">
                  <div className="today__container__content__details">
                    <div className="today__container__content__details__goal">
                      <p className="today__container__content__label">Goal:</p>
                      <p className="today__container__content__text">
                        page 280 to 340
                      </p>
                    </div>
                    <div className="today__container__content__details__duration">
                      <p className="today__container__content__label">
                        Duration:
                      </p>
                      <p className="today__container__content__text">20 min</p>
                    </div>
                  </div>

                  <div className="today__container__content__total-pages">
                    <p className="today__container__content__label">
                      Total pages
                    </p>
                    <p className="today__container__content__text">280 / 890</p>
                  </div>
                </div>
                {/* days left */}
                <div className="today__container__days-left">
                  <Timeline
                    heading="Days until deadline"
                    daysLeft="12"
                    percentage="22"
                    style="bar"
                  ></Timeline>
                </div>
                {/* chunks left */}
                <div className="today__container__chunks-left">
                  <Timeline
                    heading="Chunks left to study"
                    daysLeft="7"
                    percentage="50"
                    style="chunks"
                  ></Timeline>
                </div>

                {/* buttons */}
                <div className="today__container__buttons">
                  {/* open notes or link */}
                  {/* TODO: add link to exam */}
                  <a href="/exams" className="today__container__buttons__open">
                    open notes
                  </a>

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
                          placeholder="120"
                          ref={register({
                            min: 1,
                            max: 10000,
                          })}
                          // TODO: maximum is page amount
                          // TODO: placeholder is current page
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
