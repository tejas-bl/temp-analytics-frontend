import React from "react";
import { useField, useFormikContext } from "formik";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

function DatePickerField({ ...props }){
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
      <Datetime
        {...field}
        {...props}
        // dateFormat="yyyy-MM-dd"
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
    );
  };


export default DatePickerField;