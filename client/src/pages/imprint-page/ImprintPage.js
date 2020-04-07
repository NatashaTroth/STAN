import React from "react"
// --------------------------------------------------------------

// image ----------------
import Stan from "../../images/mascots/iAmStan.svg"

// sub-components
import Image from "../../components/image/Image"

function Imprint() {
  // return ----------------
  return (
    <div className="imprint-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-m-10">
            <div className="imprint__headline">
              <h2>Imprint</h2>
            </div>

            <div className="imprint__content imprint-content">
              <p>This is a MultiMedia Project 3 by Natasha, Tra and Daniela.</p>

              <Image
                path={Stan}
                alt="a mascot is holding up a letter"
                className="imprint__content--mascot"
              />
            </div>

            <div className="imprint__content">
              <p>
                Fachhochschule Salzburg GmbH
                <br></br>
                Urstein Süd 1<br></br>
                A-5412
                <br></br>
                Puch/Salzburg Österreich
              </p>
            </div>

            <div className="imprint__content">
              <div className="imprint__content--contact">
                <p>
                  <strong>T </strong>
                  <a href="tel:+435022110" className="imprint__content--link">
                    +43 50-2211-0
                  </a>
                </p>
                <p>
                  <strong>Mail </strong>
                  <a
                    href="mailto:medien@fh-salzburg.ac.at"
                    className="imprint__content--link"
                  >
                    medien@fh-salzburg.ac.at
                  </a>
                </p>
              </div>
            </div>

            <div className="imprint__content">
              <p>© 2020 FH Salzburg</p>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Imprint
