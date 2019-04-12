import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select } from "zent";
import * as moment from "moment-jalaali";

const Option = Select.Option;

class DatePcikerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: this.props.day,
      month: this.props.month,
      year: this.props.year,
      hour: this.props.hour,
      minute: this.props.minute,
      seconds: this.props.seconds,
      monthList: [
        { title: "فروردین", value: 1 },
        { title: "اردیبهشت", value: 2 },
        { title: "خرداد", value: 3 },
        { title: "تیر", value: 4 },
        { title: "مرداد", value: 5 },
        { title: "شهریور", value: 6 },
        { title: "مهر", value: 7 },
        { title: "آبان", value: 8 },
        { title: "آذر", value: 9 },
        { title: "دی", value: 10 },
        { title: "بهمن", value: 11 },
        { title: "اسفند", value: 12 }
      ],
      currentDays: moment.jDaysInMonth(moment().jYear(), moment().jMonth()),
      currentYear: moment().jYear()
    };
  }

  calculateDaysByMonth = (year, month) => {
    this.setState(
      {
        currentDays: moment.jDaysInMonth(year, month),
        month: parseInt(month, 10),
        day: this.state.day > moment.jDaysInMonth(year, month) ? 1 : this.state.day
      },
      this.sendDataToParent
    );
  };

  updateDatePickerObj = (e, selected) => {
    switch (e.target.name) {
      case "day":
        this.setState({ day: selected.value }, this.sendDataToParent);
        break;
      case "month":
        this.calculateDaysByMonth(this.state.year, selected.value);
        break;
      case "year":
        this.setState({ year: selected.value }, this.sendDataToParent);
        break;
      default:
        return null;
    }
  };

  sendDataToParent = () => {
    let status = typeof this.props.status === "undefined" ? null : this.props.status;
    this.props.onUpdate(this.state, status);
  };

  render() {
    let years = [],
      loop = -1;
    while (++loop <= 5) years.push(this.state.currentYear + loop);
    const days = [...Array(this.state.currentDays + 1).keys()];
    return (
      <div className="datepicker-group" style={this.props.style}>
        <Select autoWidth className="day" placeholder="روز" onChange={this.updateDatePickerObj} name="day" value={this.state.day}>
          {days.map(x => (
            <Option key={x} value={x}>
              {x}
            </Option>
          ))}
        </Select>
        <Select autoWidth className="month" placeholder="ماه" name="month" onChange={this.updateDatePickerObj} value={this.state.month}>
          {this.state.monthList.map(x => (
            <Option key={x.value} value={x.value}>
              {x.title}
            </Option>
          ))}
        </Select>
        <Select autoWidth className="year" placeholder="سال" name="year" onChange={this.updateDatePickerObj} value={this.state.year}>
          {years.map(x => (
            <Option key={x} value={x}>
              {x}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

DatePcikerComponent.propTypes = {
  day: PropTypes.number,
  month: PropTypes.number,
  year: PropTypes.number
};

export default DatePcikerComponent;
