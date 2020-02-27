import React from "react"

// sub-components
import Paragraph from "../../components/paragraph/Paragraph"
import SubHeading from "../../components/sub-heading/SubHeading"
import Listing from "../../components/listing/Listing"
import Button from "../../components/button/Button"

function Home() {
  return (
    <div className="home">
      <div className="row">
        <div className="col-md-6">
          <h2 className="home__heading">Organize your Study Plan</h2>
          <SubHeading className="sub-heading" text="Easy . Fast . Online" />

          <Paragraph
            className="home__text"
            text="Students like you can add and organize their learning material for exams with Stan! Stan supports you in dividing up your tasks for each subject. Deadlines, as well as calculated learning chunks, are visualized so you can keep track of your progress and counter procrastination."
          />

          <div className="home__list">
            <Listing
              className="home__list--item"
              text="increase your learning motivation"
            />
            <Listing
              className="home__list--item"
              text="decrease your procrastination"
            />
          </div>

          <Button
            className="stan-btn-double"
            variant="button"
            text="Start now"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
