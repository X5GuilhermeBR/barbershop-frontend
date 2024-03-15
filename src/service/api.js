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

    export const getBarbers = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado na sessionStorage');
      }
    
      return api
        .get(`/accounts/barbers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          return response;
        })
        .catch((error) => {
          console.error('Erro ao fazer a requisição:', error);
          throw error;
        });
    };

export const login = async (email, password) =>
  api
    .post(`/login`, {
      email: `${email}`,
      password: `${password}`,
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

export const checkScheduleById = async (userId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const params = {};

  if (userId) {
    params.userId = userId;
  }

  return api
    .get(`/schedule`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response;
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    });
};

export const getServices = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  return api
    .get(`/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response;
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    });
};

export const getSchedule = async (startDate, endDate, userId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  let queryString = '';

  if (startDate && endDate) {
    queryString += `startDate=${startDate}&endDate=${endDate}&userId=${userId}`;
  }

  const url = `/schedule?${queryString}`;

  return api
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response;
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    });
};