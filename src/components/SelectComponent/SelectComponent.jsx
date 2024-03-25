/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { MenuItem, Select } from '@mui/material';
import React from 'react';

function SelectComponent({ label, value, onChange, items }) {
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
      {items &&
        items.map((item) => {
          const { client_name, barber_name, ...rest } = item;
          const itemName = client_name || barber_name || rest.name;

          return (
            <MenuItem key={item.id} value={item}>
              {itemName}
            </MenuItem>
          );
        })}
    </Select>
  );
}

export default SelectComponent;
