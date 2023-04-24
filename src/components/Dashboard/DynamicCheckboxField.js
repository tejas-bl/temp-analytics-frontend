import React, { Component } from "react";

// class DynamicCheckboxField extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             valueArray: (props.field.value) ? props.field.value : []
//         }
//         this.handleCheckChange = this.handleCheckChange.bind(this);
//         this.setStateAsync = this.setStateAsync.bind(this);
//     }

//     componentDidUpdate(prevProps){
//         if(prevProps !== this.props){
//             console.log(this.props);
//         }
//     }
//     setStateAsync(state) {
//         console.log("setting State")
//         return new Promise((resolve) => {
//             this.setState(state, resolve)
//         });
//     }
//     async handleCheckChange(e) {

//         if (e.target.checked) {
//             await this.setStateAsync({ valueArray: [...this.state.valueArray, e.target.value] });

//             console.log("setting State done");
//             this.props.form.setFieldValue(this.props.field.name, this.state.valueArray);
//         } else {

//             console.log("Unchecked", e.target.checked);
//             await this.setStateAsync({
//                 valueArray: this.state.valueArray.filter(function (v) {
//                     return v !== e.target.value
//                 })});
            
//             // this.setState({
//             //     valueArray: this.state.valueArray.filter(function (v) {
//             //         return v !== e.target.value
//             //     })
//             // });
//             // valueArray.splice(valueArray.indexOf(e.target.value), 1);
//             this.props.form.setFieldValue(this.props.field.name, this.state.valueArray);
//         }


//         // console.log("valueArray",this.state.valueArray);
//     };

//     render() {
//         const {
//             field: { name, value, onChange, onBlur },
//             form: { errors, touched, setFieldValue, dirty },
//             label,
//             personaId,
//         } = this.props;  
//         const checked = this.state.valueArray.includes(personaId);
//         return (<div
//             className={
//                 `m-checkbox m-checkbox--switch ${value && dirty ? "dirty input-checkbox" : "input-checkbox"}`}
//         >
//             <input
//                 name={`${name}`}
//                 type="checkbox"
//                 value={personaId}
//                 checked={checked}
//                 onChange={e => {
//                     // onChange(e);
//                     this.handleCheckChange(e);
//                 }}
//                 onBlur={onBlur}
//                 className={`m-checkbox__input m-checkbox--switch__input ${touched[name] && errors[name] ? "invalid" : ""}`}
//             />
//             <label>
//                 <span className="label">{label}</span>
//             </label>

//             {touched[name] && errors[name] && (
//                 <span className="error">{errors[name]}</span>
//             )}
//         </div>)
//     }
// }



const DynamicCheckboxField = ({
    field: { name, value, onChange, onBlur },
    form: { errors, touched, setFieldValue, dirty },
    label,
    entryId,
    entryIndex,
    personaId,
    selected,
    handleCheckbox,
    ...props
}) => {

    let valueArray = value || [];
    const handleCheckChange = e => {
        if (e.target.checked) {

            valueArray.push(e.target.value);
            handleCheckbox(e.target.value,true, valueArray);
            setFieldValue(name, valueArray);
        } else {
            valueArray.splice(valueArray.indexOf(e.target.value), 1);
            handleCheckbox(e.target.value,false, valueArray);
            setFieldValue(name, valueArray);
        }
    };

    const checked = valueArray.includes(personaId);
    return (
        <div
        className={
            `col-md-6 col-lg-6 m-checkbox m-checkbox--switch ${value && dirty ? "dirty input-checkbox" : "input-checkbox"}`}
    >
        <input
            name={`${name}`}
            type="checkbox"
            value={personaId}
            checked={checked}
            onChange={e => {
                // onChange(e);
                handleCheckChange(e);
            }}
            onBlur={onBlur}
            className={`m-checkbox__input m-checkbox--switch__input ${touched[name] && errors[name] ? "invalid" : ""}`}
        />
            <label htmlFor={`${name}`} className="mb-0 ml-2">
                <span className="label">{label}</span>
            </label>

            {touched[name] && errors[name] && (
                <span className="error">{errors[name]}</span>
            )}
        </div>
    );
};

export default DynamicCheckboxField;