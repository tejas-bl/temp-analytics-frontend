import { getMonth, getYear } from 'date-fns';
import React from 'react';
import Picker from 'react-month-picker';
import MonthBox from "../helper/MonthBox";
class MonthPicker extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            singleValue: { year: getYear(new Date()), month: getMonth(new Date())  }
        }
        this.pickAMonth = React.createRef()
    }

    show() {
        if (!this.state.showed) {
            setTimeout(() => { this.state.closeable = true }, 250)
            this.setState({ showed: true })
        }
    }

    handleClickMonthBox = (e) => {
        this.pickAMonth.current.show()
    }

    handleAMonthChange = (value, text) => {
        if (text < 10) {
            return `${value}-0${text}-01`;
        } else {
            return `${value}-${text}-01`;
        }
    }

    handleAMonthDismiss = (value) => {
        if (value.year !== this.state.singleValue.year || value.month !== this.state.singleValue.month) {
            this.setState({ singleValue: value })
            if (value.month < 10) {
                this.props.onClickHandleMonthChange(`${value.year}-0${value.month}-01`);
            } else {
                this.props.onClickHandleMonthChange(`${value.year}-${value.month}-01`);
            }
        }
    }


    render() {
        const pickerLang = {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            from: 'From', to: 'To',
        }
        const makeText = m => {
            if (m && m.year && m.month) return (pickerLang.months[m.month - 1] + '. ' + m.year)
            if(m && m.year && m.month === 0) return (pickerLang.months[11] + '. ' + (m.year - 1))
            return '?'
        }
        return (
            <Picker
                ref={this.pickAMonth}
                years={{ min: 2013 }}
                value={this.state.singleValue}
                lang={pickerLang.months}
                onChange={this.handleAMonthChange}
                onDismiss={this.handleAMonthDismiss}
            >
                <MonthBox value={makeText(this.state.singleValue)} onClick={this.handleClickMonthBox} />
            </Picker>
        )
    }

}

export default MonthPicker;
