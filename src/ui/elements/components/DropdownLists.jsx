import React, { useState, useEffect } from 'react';

export function DropdownList({ options, value, onChange, placeholder }) {
  const dropdownStyle = {
    margin: '5px 15px',
    padding: '8px 10px 8px 10px',
    // width: '40%',
    color: '#355065',
    border: 'solid #C0C0C0 1.4px',
    fontSize: '14px',
    borderRadius: '6px',
    userSelect: 'auto',
  };

  return (
    <select style={dropdownStyle} value={value} onChange={onChange}>
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export function DropdownListDoctors({ options, value, onChange, placeholder }) {
  const dropdownStyle = {
    margin: '5px 15px',
    padding: '8px 10px 8px 10px',
    width: '65%',
    color: '#355065',
    border: 'solid #C0C0C0 1.4px',
    fontSize: '14px',
    borderRadius: '6px',
    userSelect: 'auto',
  };

  return (
    <select style={dropdownStyle} value={value} onChange={onChange}>
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.lastname} {option.name} {option.surname}
        </option>
      ))}
    </select>
  );
};

export function DropdownListDiagnoses({ options, value, onChange, placeholder }) {
  const dropdownStyle = {
    margin: '5px 15px',
    padding: '8px 10px 8px 10px',
    width: '65%',
    color: '#355065',
    border: 'solid #C0C0C0 1.4px',
    fontSize: '14px',
    borderRadius: '6px',
    userSelect: 'auto',
  };

  return (
    <select style={dropdownStyle} value={value} onChange={onChange}>
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name} ({option.unit})
        </option>
      ))}
    </select>
  );
};





// export function DropdownList({ data, defaultSelectedId, onSelect, hint }) {
//   const [selectedId, setSelectedId] = useState(defaultSelectedId);

//   const handleChange = (event) => {
//     const selectedId = event.target.value;
//     console.log(selectedId)
//     setSelectedId(selectedId);
//     onSelect(selectedId);
//   };

//   useEffect(() => {
//     setSelectedId(defaultSelectedId);
//   }, [defaultSelectedId]);

//   return (
//     <select className='modal_dropdown_select' value={selectedId} onChange={handleChange}>
//       <option className='modal_dropdown_option' value="">{hint}</option>
//       {data.map((item) => (
//         <option key={item.id} value={item.id}>
//           {item.name}
//         </option>
//       ))}
//     </select>
//   );
// }



