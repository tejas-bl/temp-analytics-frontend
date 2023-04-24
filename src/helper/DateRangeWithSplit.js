import React from 'react';
import { Button } from 'react-bootstrap';
import DateRangeWithSplitModalCard from './Component/DateRangeWithSplitModalCard';
import { convertDateTOLocale, formatDate } from './Utils';
class DateRangeWithSplit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDateRangeModal: false,
            startDate: props.startDate,
            endDate: props.endDate,
            dateRange: props.dateRange,
            updatedDateLoading : true
        }
        this.handleDateRangeModel = this.handleDateRangeModel.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate || prevProps.dateRange !== this.props.dateRange){
            this.setState({
                startDate: this.props.startDate,
                endDate: this.props.endDate,
                dateRange: this.props.dateRange,
                updatedDateLoading: false
            })
        }
    }
    handleDateRangeModel(dateRange, splitLengthAddedIndex){
        // this.setState({
        //     startDate: dateRange.startDate,
        //     endDate: dateRange.endDate,
        //     updatedDateLoading: false
        // })
        this.props.onDateRangeChange(dateRange, splitLengthAddedIndex);
    }
    onClickDateRangeModal() {
        this.setState({ showDateRangeModal: !this.state.showDateRangeModal })
    }

    render() {
        return (
            <>
                {this.state.dateRange.length !== undefined && this.state.dateRange.length > 0 && <Button  disabled={!this.state.dateRange}  onClick={()=>{ this.onClickDateRangeModal(); }} className="btn btn-outline-info btn-info text-white mr-2"><span>{formatDate(this.state.startDate)} - {formatDate(this.state.endDate)}</span> <i className="fa fa-calendar"></i> </Button>}
                    {/* convertDateTOLocale(this.state.startDate, true) */}
                    {/* convertDateTOLocale(this.state.endDate, true) */}
                <DateRangeWithSplitModalCard
                    key={"date_range"}
                    size={"auto"}
                    title={"Set Date Range"}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    product={this.props.product}
                    dateRange={!this.state.updatedDateLoading && this.state.dateRange}
                    onClickDateRangeModel={this.handleDateRangeModel}
                    show={this.state.showDateRangeModal}
                    onClose={() => this.onClickDateRangeModal()}
                />

            </>
        )
    }


}

export default DateRangeWithSplit;