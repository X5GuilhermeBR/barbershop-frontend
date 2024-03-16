import * as yup from 'yup';

const loginSchema = yup.object().shape({
    email: yup.string().email().required('O campo de e-mail é obrigatório'),
    password: yup.string().required('O campo de senha é obrigatório').min(6),
  });

export default loginSchema;