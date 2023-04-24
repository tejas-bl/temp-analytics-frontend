import React, { useEffect, useState } from 'react';
import { useField, useFormikContext } from "formik";
import { TimezoneSelect, clientTz, findTzByKey } from 'timezone-select-js';

function TimezoneField({currentTz, ...props }){
  const [selectedTimezone, setSelectedTimezone] = useState(currentTz !== null && currentTz !== undefined ? currentTz :  clientTz() );
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  useEffect(()=>{
    if(currentTz !== null && currentTz !== undefined){
      setFieldValue(field.name,findTzByKey(currentTz));
    }
    else{
      setFieldValue(field.name,findTzByKey(selectedTimezone));
    }
  },[])
  return (
    <div className='app'>
      <div>
        <TimezoneSelect
          {...field}
          {...props}
        //   value={selectedTimezone}
        //   onChange={setSelectedTimezone}
          value={selectedTimezone}
          onChange={(val) => {
            setSelectedTimezone(val);
            setFieldValue(field.name, val);
          }}

        />
      </div>
    </div>
  )
};

export default TimezoneField;