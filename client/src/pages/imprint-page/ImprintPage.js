import React from "react"
// --------------------------------------------------------------

function Imprint() {
  // return ----------------
  return (
    <div className="imprint-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h2 className="imprint-page__heading">Imprint</h2>
          </div>
          <div className="col-md-6">
            <p className="imprint-page__text">
              This is a MultiMedia Project 3 by Natasha, Tra and Daniela.
            </p>
            <p className="imprint-page__text">
              Fachhochschule Salzburg GmbH
              <br></br>
              Urstein Süd 1<br></br>
              A-5412
              <br></br>
              Puch/Salzburg Österreich
            </p>
            <div className="imprint-page__contact">
              <p className="imprint-page__contact__container">
                <strong>T </strong>
                <a
                  href="tel:+435022110"
                  className="imprint-page__contact__container__link"
                >
                  +43 50-2211-0
                </a>
              </p>
              <p className="imprint-page__contact__container">
                <strong>Mail </strong>
                <a
                  href="mailto:medien@fh-salzburg.ac.at"
                  className="imprint-page__contact__container__link"
                >
                  medien@fh-salzburg.ac.at
                </a>
              </p>
            </div>
            <p className="imprint-page__text">© 2020 FH Salzburg</p>
          </div>
          <div className="col-md-6"></div>
        </div>
      </div>
    </div>
  )
}

export default Imprint
