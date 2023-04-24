import React from "react";
import { DateRangePicker } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Button, Modal } from "react-bootstrap";

class DateRangeModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRangeOptions: [{
                startDate: props.startDate,
                endDate: props.endDate,
                key: 'selection'
            }]
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
            this.setState({
                dateRangeOptions: [{
                    startDate: this.props.startDate,
                    endDate: this.props.endDate,
                    key: 'selection'
                }],
            })
        }
    }

    handleDateChange(item) {
        this.setState({
            dateRangeOptions: [item.selection]
        })
    }
    setDateRange() {
        this.props.onClose();
        this.props.onClickDateRangeModel(this.state.dateRangeOptions);
    }
    render() {
        const { title, onClose, size, show } = this.props;
        return (
            <Modal dialogClassName="dateRangeModal" size={size} show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DateRangePicker
                        onChange={item => this.handleDateChange(item)}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={this.state.dateRangeOptions}
                        direction="horizontal" />
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={() => this.setDateRange()}>Set Date</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DateRangeModalCard;