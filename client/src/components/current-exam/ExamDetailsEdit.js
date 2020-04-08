import React from "react"
import { Redirect, useHistory } from "react-router"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// sub-components ----------------
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Textarea from "../../components/textarea/Textarea"
import Button from "../../components/button/Button"

const ExamDetailsEdit = ({ examId }) => {
  console.log(examId)

  return <div className="examsEdit"></div>
}

export default ExamDetailsEdit
