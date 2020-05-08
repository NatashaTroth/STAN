import React from "react"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"
import { formatDate, parseDate } from "react-day-picker/moment"
// --------------------------------------------------------------

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    this.handleDayChange = this.handleDayChange.bind(this)
    this.state = {
      selectedDay: undefined,
    }
  }

  handleDayChange(selectedDay) {
    this.setState({
      selectedDay,
    })
    this.props.onDaySelected(selectedDay)
  }

  render() {
    const { selectedDay } = this.state
    const FORMAT = "DD.MM.yyyy"
    const today = new Date()

    // return ----------------
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
