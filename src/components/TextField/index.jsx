/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

// Componente de TextField. Fazer o Textfield receber as props que quiser (label, helper text, etc)
function Component({ name, ...props }) {
  // O Textfield ficaria envolvido em um "Form Provider"
  const { register, clearErrors } = useFormContext();

  return (
    // O name dado no "register" é o nome do campo que você quer mapear. Ele vai ficar salvo no contexto exatamente com esse nome.
    <TextField {...register(name)} onKeyDown={() => clearErrors(name)} {...props} />
  );
}

export default Component;
