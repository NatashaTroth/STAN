import React from "react"

// sub-components
import Listing from "../../components/listing/Listing"
import Paragraph from "../../components/paragraph/Paragraph"
import Image from "../../components/image/Image"

// images
import Pic1 from "../../images/desk1.png"
import Pic2 from "../../images/desk2.png"

function About() {
  return (
    <div className="about">
      <div className="container-fluid">
        <div className="about__row-1 row">
          <div className="col-md-12">
            <h2 className="about__heading">Who is stan?</h2>
            <p className="sub-heading">We will explain</p>
          </div>

          <div className="col-md-6">
            <Listing className="list-item" text="your online study plan" />

            <div className="about__content">
              <Paragraph
                className=""
                text="Students like you can easily add and organize their learning material for exams with Stan. Simply add your exam subjects in your stan dashboard and prioritize them. Stan will then automatically calculate your personal learning chunks."
              />
            </div>

            <div className="about__btn">
              <a href="/sign-up" className="stan-btn-double">
                Join stan
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <Image
              path={Pic1}
              alt="Desk with devices and cup of coffee"
              className="about__img"
            />
          </div>
        </div>

        <div className="about__row-2 row">
          <div className="col-md-6">
            <Image
              path={Pic2}
              alt="Desk with a pen and cup of coffee"
              className="about__img"
            />
          </div>

          <div className="col-md-6">
            <Listing className="list-item" text="fight procrastination" />

            <div className="about__content">
              <Paragraph
                className=""
                text="Students like you can easily add and organize their learning material for exams with Stan. Simply add your exam subjects in your stan dashboard and prioritize them. Stan will then automatically calculate your personal learning chunks."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
