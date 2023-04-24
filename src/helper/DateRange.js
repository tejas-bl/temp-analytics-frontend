import React from 'react';
import { Button } from 'react-bootstrap';
import DateRangeModalCard from './Component/DateRangeModalCard';
import { convertDateTOLocale, formatDate } from './Utils';
class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDateRangeModal: false,
            startDate: props.startDate,
            endDate: props.endDate,
            updatedDateLoading: true
        }
        this.handleDateRangeModel = this.handleDateRangeModel.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
            this.setState({
                startDate: this.props.startDate,
                endDate: this.props.endDate,
                updatedDateLoading: false
            })
        }
    }
    handleDateRangeModel(dateRange) {
        // this.setState({
        //     startDate: dateRange.startDate,
        //     endDate: dateRange.endDate,
        //     updatedDateLoading: false
        // })
        this.props.onDateRangeChange(dateRange);
    }
    onClickDateRangeModal() {
        this.setState({ showDateRangeModal: !this.state.showDateRangeModal })
    }

    render() {
        return (
            <>
                <Button onClick={() => { this.onClickDateRangeModal(); }} className="btn btn-outline-info btn-info text-white mr-2"><span>{formatDate(this.state.startDate)} - {formatDate(this.state.endDate)}</span> <i className="fa fa-calendar"></i> </Button>
                {/* {convertDateTOLocale(this.state.startDate, true)} - {convertDateTOLocale(this.state.endDate, true)} */}
                <DateRangeModalCard
                    key={"date_range"}
                    size={"auto"}
                    title={"Set Date Range"}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onClickDateRangeModel={this.handleDateRangeModel}
                    show={this.state.showDateRangeModal}
                    onClose={() => this.onClickDateRangeModal()}
                />

            </>
        )
    }


}

export default DateRange;