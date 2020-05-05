import React from "react"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"
import { DateUtils } from "react-day-picker"

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale })
}

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.handleDayChange = this.handleDayChange.bind(this)
    this.state = {
      selectedDay: undefined,
      isEmpty: true,
      isDisabled: false,
    }
  }

  handleDayChange(selectedDay, modifiers, dayPickerInput) {
    const input = dayPickerInput.getInput()
    this.setState({
      selectedDay,
      isEmpty: !input.value.trim(),
      isDisabled: modifiers.disabled === true,
    })
    this.props.onDaySelected(selectedDay)
  }

  render() {
    const { selectedDay, isDisabled, isEmpty } = this.state
    const FORMAT = "dd.MM.yyyy"
    const today = new Date()

    return (
      <DayPickerInput
        value={selectedDay}
        onDayChange={this.handleDayChange}
        dayPickerProps={{
          selectedDays: selectedDay,
          disabledDays: { before: today, after: this.props.disabledAfter },
          modifiersStyles: {
            selected: {
              color: "white",
              backgroundColor: "#03719e",
            },
            today: {
              color: "#fec902",
            },
          },
        }}
        inputProps={{ required: true }}
        formatDate={formatDate}
        format={FORMAT}
        parseDate={parseDate}
        placeholder="DD.MM.YYYY"
      />
    )
  }
}
