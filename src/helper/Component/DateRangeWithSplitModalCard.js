import React from "react";
import { DateRangePicker } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Button, Modal } from "react-bootstrap";
import { subDays, format, isWeekend, isSameDay, differenceInDays } from "date-fns";
import { convertDateTOLocale } from "../Utils";

class DateRangeWithSplitModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRangeOptions: {},
            initialDateRangeOptions: {},
            initialDateRangeOptionsLoaded: false,
            initialDateRangeOptionArray: [],
            initialDateRangeOptionArrayLoaded: false,
            splitMinDate: subDays(new Date(), 480),
            splitMaxDate: new Date(),
            dateRangeOptionsLoading: true,
            dateRangeOptionArray: [],
            colorRangeArray: [],
            dateStaticRangeLabels: [],
            selectStartDate: false,
            selectEndDate: false,
            splitLengthAddedIndex: null
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
    }

    splitDay(day) {
        let extraDot = null;
        if (isWeekend(day)) {
            extraDot = (
                <div
                    style={{
                        height: "5px",
                        width: "5px",
                        borderRadius: "100%",
                        background: "orange",
                        position: "absolute",
                        top: 2,
                        right: 2,
                    }}
                />
            )
        }
        return (
            <div>
                {extraDot}
                <span>{format(day, "d")}</span>
            </div>
        )
    }

    async componentDidUpdate(prevProps) {
        let dateRangeOptionsData = {};
        let dateRangeOptionsArrayData = [];
        let dateStaticRangeLabelsArrayData = [];
        let colorRange = ["#ed3d37", "#faad32", "#e54acd", "#9052ff", "#f45aa2", "#4de453", "#c5af2e", "#0fa5ed", "#9052dd"];
        if (prevProps.dateRange !== this.props.dateRange) {
            if (this.props.dateRange !== false) {
                let splitLengthAddedIndex = this.props.dateRange.length + 1;
                for (let i = 0; i < this.props.dateRange.length; i++) {

                   /*  if (this.props.dateRange[i] !== null) { } */
                    let key_i = i + 1;

                    const selectionKeyData = {
                        startDate: this.props.dateRange[i].splitDate,
                        endDate: this.props.dateRange[i + 1] !== undefined && this.props.dateRange[i + 1] !== null ? subDays(this.props.dateRange[i + 1]["splitDate"], 1) : new Date(),
                        key: `selection${key_i}`,
                        //showDateDisplay: key_i !== 1 ? false : true,
                        showDateDisplay: false,
                        // showDateDisplay : true,
                        //autoFocus: key_i !== 1 ? false : true
                        autoFocus: false,
                        abPerc: this.props.dateRange[i].abPerc
                    }

                    dateRangeOptionsData = {
                        ...dateRangeOptionsData,
                        ["selection" + key_i]: selectionKeyData,
                        abPerc: this.props.dateRange[i].abPerc
                    }

                    dateRangeOptionsArrayData.push({ ["selection" + key_i]: selectionKeyData, abPerc: this.props.dateRange[i].abPerc });

                    
                    if (this.props.product !== 'engage') {
                        dateStaticRangeLabelsArrayData.push({
                            label: <><div style={{ color: "#222", display: "flex", alignItems: "center" }}><span style={{ display: "inline-block", backgroundColor: colorRange[i], height: "15px", width: "15px", borderRadius: "1000px", marginRight: "5px" }}> </span>{i === 0 ? "Listening Phase" : this.props.dateRange[i].split_change === false ? "Protection Phase" : "Split Change - " + this.props.dateRange[i].abPerc}
                            </div><span style={{ marginLeft: "20px", fontSize: "13px", color: "#bdbdbd", display: "block" }}> {format(selectionKeyData.startDate, "yyyy-MM-dd")} - {format(selectionKeyData.endDate, "yyyy-MM-dd")} </span> </>,
                            // hasCustomRendering: true,
                            range: () => (selectionKeyData),
                            isSelected() {
                                return false;
                            },
                        })
                    }else{

                        if(this.props.dateRange[i].phaseStatus !== 'engage_off' ){
                            dateStaticRangeLabelsArrayData.push({
                                label: <><div style={{ color: "#222", display: "flex", alignItems: "center" }}><span style={{ display: "inline-block", backgroundColor: colorRange[i], height: "15px", width: "15px", borderRadius: "1000px", marginRight: "5px" }}> </span>
                                { "Split Change - " + this.props.dateRange[i].abPerc}
                                </div><span style={{ marginLeft: "20px", fontSize: "13px", color: "#bdbdbd", display: "block" }}> {format(selectionKeyData.startDate, "yyyy-MM-dd")} - {format(selectionKeyData.endDate, "yyyy-MM-dd")} </span> </>,
                                // hasCustomRendering: true,
                                range: () => (selectionKeyData),
                                isSelected() {
                                    return false;
                                },
                            })
                        }
                        
                    }

                }


                let lastSelectionKeyData = {}; 
                // console.log("this.props.dateRange.length --- ", this.props.dateRange[this.props.dateRange.length - 1].splitDate)
                if(this.props.dateRange.length > 0){
                    if(differenceInDays(new Date(), this.props.dateRange[this.props.dateRange.length - 1].splitDate) > 30){
                        lastSelectionKeyData = {
                            startDate: subDays(new Date(), 29),
                            endDate: new Date(),
                            key: `selection${splitLengthAddedIndex}`,
                            showDateDisplay: true,
                            // showDateDisplay : true,
                            autoFocus: true,
                            abPerc: this.props.dateRange[this.props.dateRange.length - 1].abPerc
                        }
                    }else{
                        lastSelectionKeyData = {
                            startDate: this.props.dateRange[this.props.dateRange.length - 1].splitDate,
                            endDate: new Date(),
                            key: `selection${splitLengthAddedIndex}`,
                            showDateDisplay: true,
                            // showDateDisplay : true,
                            autoFocus: true,
                            abPerc: this.props.dateRange[this.props.dateRange.length - 1].abPerc
                        }
                    }
                }

                dateRangeOptionsData = {
                    ...dateRangeOptionsData,
                    ["selection" + splitLengthAddedIndex]: lastSelectionKeyData
                }

                dateRangeOptionsArrayData.push({ ["selection" + splitLengthAddedIndex]: lastSelectionKeyData });

                /*                 if(!this.state.initialDateRangeOptionsLoading){
                
                                    console.log("this.state.initialDateRangeOptionsLoading ---- ", this.state.initialDateRangeOptionsLoading)
                                    this.setState({
                                        initialDateRangeOptionArray: dateRangeOptionsArrayData,
                                        initialDateRangeOptionArrayLoaded: true,
                                        initialDateRangeOptions: dateRangeOptionsData,
                                        initialDateRangeOptionsLoaded: true
                                    })
                                } */

                this.setState(prevState => ({
                    dateRangeOptions: dateRangeOptionsData,
                    dateRangeOptionArray: dateRangeOptionsArrayData,
                    dateStaticRangeLabels: dateStaticRangeLabelsArrayData,
                    dateRangeOptionsLoading: false,
                    splitMinDate: dateRangeOptionsArrayData[0].selection1.startDate,
                    // subDays(new Date(), 480)
                    splitMaxDate: new Date(),
                    splitLengthAddedIndex: splitLengthAddedIndex,
                }))
                /*                 
                this.setState(prevState => ({
                    dateRangeOptions: {...prevState.dateRangeOptions,
                        ["selection" + key_i]: {
                            startDate:  this.props.dateRange[i].splitDate,
                            endDate: this.props.dateRange[i + 1] !== undefined ?  this.props.dateRange[i+1]["splitDate"] : new Date(),
                            key: `selection${key_i}`
                        }
                    },
                    dateRangeOptionsLoading: false
                  })) */
            }
        }
    }


    renderStaticRangeLabel = () => (
        <span>CUstom Label --- </span>
    );

    handleDateChange(item) {

        let droa = this.state.dateRangeOptionArray;
        let droa_length = this.state.dateRangeOptionArray.length
        let storeDateRange = [];
        Object.values(item)[0].key = "selection" + droa_length;
        Object.values(item)[0].showDateDisplay = true;
        if (!this.state.selectStartDate && !isSameDay(Object.values(item)[0].startDate, Object.values(item)[0].endDate)) {
            this.setState(prevState => {
                return {
                    dateRangeOptions: { ...this.state.dateRangeOptions, ...item },
                    splitMinDate: this.props.dateRange[0].splitDate,
                    splitMaxDate: new Date()
                }
            })
        } else {
            this.setState(prevState => {

                if (!this.state.selectStartDate) {
                    for (let i = 0; i < droa.length; i++) {
                        if (new Date(convertDateTOLocale(item["selection" + droa_length].startDate)) >= new Date(convertDateTOLocale(droa[i][Object.keys(droa[i])[0]].startDate)) && new Date(convertDateTOLocale(item["selection" + droa_length].startDate)) <= new Date(convertDateTOLocale(droa[i][Object.keys(droa[i])[0]].endDate))) {
                            storeDateRange.push([droa[i][Object.keys(droa[i])[0]].startDate, droa[i][Object.keys(droa[i])[0]].endDate]);
                            break;
                        }
                    }
                    return {
                        dateRangeOptions: { ...this.state.dateRangeOptions, ...item },
                        splitMinDate: storeDateRange[0][0],
                        splitMaxDate: storeDateRange[0][1],
                        selectStartDate: true,
                    }
                } else if (this.state.selectStartDate) {
                    return {
                        dateRangeOptions: { ...this.state.dateRangeOptions, ...item },
                        /*                         splitMinDate: this.props.dateRange[0].splitDate,
                                                splitMaxDate: new Date(), */
                        splitMinDate: this.state.dateRangeOptionArray[0].selection1.startDate,
                        splitMaxDate: new Date(),
                        selectStartDate: false,
                    }
                }
            })
        }


        /*         this.setState({
                    dateRangeOptions: { ...this.state.dateRangeOptions, ...item }
                }) */
    }
    setDateRange() {
        this.props.onClose();
        this.props.onClickDateRangeModel(this.state.dateRangeOptions, this.state.splitLengthAddedIndex);
    }
    render() {
        const { title, onClose, size, show } = this.props;
        return (
            <Modal dialogClassName="dateRangeModal" size={size} show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="splitDateRangeModalBody">
                    {this.props.dateRange !== false && <DateRangePicker
                        onChange={item => this.handleDateChange(item)}
                        showSelectionPreview={false}
                        moveRangeOnFirstSelection={false}
                        // dayContentRenderer={this.splitDay}
                        months={2}
                        rangeColors={["#ed3d37", "#faad32", "#e54acd", "#9052ff", "#f45aa2", "#4de453", "#c5af2e", "#0fa5ed", "#9052dd"]}
                        renderStaticRangeLabel={this.renderStaticRangeLabel}
                        // ranges={[this.state.dateRangeOptions.selection1, this.state.dateRangeOptions.selection2, this.state.dateRangeOptions.selection3, this.state.dateRangeOptions.selection4, this.state.dateRangeOptions.selection5]}
                        ranges={this.props.dateRange !== false && !this.state.dateRangeOptionsLoading ? this.state.dateRangeOptionArray.map((selc, i) => {
                            const key = i + 1;
                            return this.state.dateRangeOptions["selection" + key];
                        }) : []}

                        minDate={this.state.splitMinDate}
                        maxDate={this.state.splitMaxDate}
                        staticRanges={this.state.dateStaticRangeLabels}
                        /* initialFocusedRange={[0,0]} */
                        /*                         focusedRange={[0,1]}
                                                onRangeFocusChange={(dateRange)=>{
                                                    console.log("Focused --- Date Range --- ", dateRange);
                                                    return [0,1];
                                                }} */
                        direction="horizontal" />}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={() => this.setDateRange()}>Set Date</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DateRangeWithSplitModalCard;