/* eslint-disable react/prop-types */
import { MenuItem, Select } from '@mui/material';
import React from 'react';

function ServiceSelect({ label, value, onChange, items }) {
  return (
    <Select
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      displayEmpty
    >
      <MenuItem value="" disabled>
        {`Selecione um ${label.toLowerCase()}`}
      </MenuItem>
      {items.map((item) => (
        <MenuItem key={item.id} value={item}>
          {item.name ? item.name : item.barber_name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default ServiceSelect;
