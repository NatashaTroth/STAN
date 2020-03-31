import React from "react"
// --------------------------------------------------------------
// sub-components ----------------
import Image from "../../components/image/Image"

// images ----------------
import Pic1 from "../../images/desk1.png"
import Pic2 from "../../images/desk2.png"

function About() {
  // return ----------------
  return (
    <div className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <h2 className="about__heading">Who is stan?</h2>
            <p className="sub-heading">We will explain</p>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="container-fluid text-image-module">
              <div className="row">
                <div className="col-xl-6">
                  <div className="about__content">
                    <h3 className="list-style">your online study plan</h3>
                    <p className="about__content__text">
                      Students like you can easily add and organize their
                      learning material for exams with Stan. Simply add your
                      exam subjects in your stan dashboard and prioritize them.
                      Stan will then automatically calculate your personal
                      learning chunks.
                    </p>
                    <div className="about__content__btn">
                      <a href="/sign-up" className="stan-btn-double">
                        Join stan
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <Image
                    path={Pic1}
                    alt="Desk with devices and cup of coffee"
                    className="about__img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="container-fluid text-image-module text-image-module--reverse">
              <div className="row">
                <div className="col-xl-6">
                  <div className="about__content">
                    <h3 className="list-style">fight procrastination</h3>
                    <p className="about__content__text">
                      Students like you can easily add and organize their
                      learning material for exams with Stan. Simply add your
                      exam subjects in your stan dashboard and prioritize them.
                      Stan will then automatically calculate your personal
                      learning chunks.
                    </p>
                  </div>
                </div>

                <div className="col-xl-6">
                  <Image
                    path={Pic2}
                    alt="Desk with devices and cup of coffee"
                    className="about__img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default About
