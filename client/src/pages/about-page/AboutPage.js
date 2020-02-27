import React from "react"

// sub-components
import Listing from "../../components/listing/Listing"
import Paragraph from "../../components/paragraph/Paragraph"
import Image from "../../components/image/Image"

function About() {
  return (
    <div className="about">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <h2 className="about__heading">Who is stan?</h2>
            <p className="sub-heading">We will explain</p>
          </div>

          <div class="col-md-6">
            <Listing className="list-item" text="your online study plan" />
            <Paragraph
              className=""
              text="Students like you can easily add and organize their learning material for exams with Stan. Simply add your exam subjects in your stan dashboard and prioritize them. Stan will then automatically calculate your personal learning chunks."
            />
            <a href="/sign-up" className="stan-btn-double">
              Join stan
            </a>
          </div>

          <div class="col-md-6"></div>
          <Image
            source="../../images/desk1.png"
            alt="Schreibtisch"
            className="about__img"
          />
        </div>
      </div>
    </div>
  )
}

export default About
