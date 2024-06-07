import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({ selectedDate, onChange }) => {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            className="modal_date_picker"
        />
    );
};

export default DatePickerComponent;