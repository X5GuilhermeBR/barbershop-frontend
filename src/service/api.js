/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export const createAccount = async ({ profile, email, name, birthday, cellphone, password }) =>
  api
    .post('/account', {
      profile: `${profile}`,
      email: `${email}`,
      name: `${name}`,
      birthday: `${birthday}`,
      cellphone: `${cellphone}`,
      password: `${password}`,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
    });

export const verifyToken = async (token) =>
  api
    .get(`/user/verify-email?token=${token}`)
    .then((response) => {
      // Lida com a resposta da requisição de sucesso
      console.log(response.data);
      return response; // Retorna o response da requisição
    })
    .catch((error) => {
      // Lida com o erro da requisição
      console.error('Erro ao fazer a requisição:', error);
      throw error; // Lança o erro para ser tratado no componente que chama a função
    });

export const login = async (email, password) =>
  api
    .post(`/login`, {
      email: `${email}`,
      password: `${password}`,
    })
    .then((response) => {
      // Lida com a resposta da requisição de sucesso
      console.log(response.data);
      return response; // Retorna o response da requisição
    })
    .catch((error) => {
      // Lida com o erro da requisição
      console.error('Erro ao fazer a requisição:', error);
      throw error; // Lança o erro para ser tratado no componente que chama a função
    });
