/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3333',
})

export const createAccount = async ({ profile, email, name, birthday, cellphone, password }) => 
    api.post('/account', {
        profile: `${profile}`,
        email: `${email}`,
        name: `${name}`,
        birthday: `${birthday}`,
        cellphone: `${cellphone}`,
        password: `${password}`
        // Outros dados que você deseja enviar no corpo da requisição
      })
      .then(response => {
        // Lida com a resposta da requisição de sucesso
        console.log(response.data);
      })
      .catch(error => {
        // Lida com o erro da requisição
        console.error('Erro ao fazer a requisição:', error);
      });