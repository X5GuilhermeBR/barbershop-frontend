/* eslint-disable no-lonely-if */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export const createAccount = async ({ profile, email, name, birthday, cellphone, password, sex }) =>
  api
    .post('/account', {
      profile: `${profile}`,
      email: `${email}`,
      name: `${name}`,
      birthday: `${birthday}`,
      cellphone: `${cellphone}`,
      password: `${password}`,
      sex: `${sex}`,
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

export const getByProfile = async (profile) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  return api
    .get(`/accounts/${profile}`, {
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

export const checkScheduleById = async (startDate, endDate, userId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  let queryString = '';

  // Verifica se startDate e endDate foram fornecidos
  if (startDate && endDate) {
    queryString += `startDate=${startDate}&endDate=${endDate}&userId=${userId}`;
  } else {
    // Verifica se apenas userId foi fornecido

if (endDate) {
      queryString += `endDate=${endDate}&userId=${userId}`;
    }
    // Verifica se apenas startDate foi fornecido
    else if (startDate) {
      queryString += `startDate=${startDate}&userId=${userId}`;
    }
    else if (userId) {
      queryString += `userId=${userId}`;
    }
  }

  const url = `/schedule?${queryString}`;

  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error;
  }
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

export const createSchedule = async (scheduleInfo) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.post('/schedule', scheduleInfo, config);
    console.log(response.data);
    return response.data; // Retorna os dados da resposta para quem chamar esta função
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error; // Lança o erro para quem chamar esta função
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  try {
    const response = await api.put(`/user/${userId}/update-password`, {
      currentPassword,
      newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  try {
    const response = await api.put(`/schedule/${scheduleId}`, scheduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    throw error;
  }
};

export const getAccount = async (userId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/account/${userId}`;

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

export const updateAccount = async (userId, name, birthday, cellphone) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/account/${userId}`;

  const requestData = {}; // Objeto para armazenar os dados a serem enviados na requisição

  // Adiciona os campos ao objeto de dados apenas se eles não estiverem vazios
  if (name) {
    requestData.name = name;
  }
  if (birthday) {
    requestData.birthday = birthday;
  }
  if (cellphone) {
    requestData.cellphone = cellphone;
  }

  return api
    .put(url, requestData, {
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

export const updateStatusUser = async (userId, status) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/user/${userId}`;

  const requestData = {"disable": status};

  return api
    .put(url, requestData, {
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

export const deleteUser = async (userId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/user/${userId}`;

  return api
    .delete(url, {
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

export const getScheduleById = async (scheduleId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/schedule/${scheduleId}`;

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

export const getProducts = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/products`;

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

export const getProductById = async (productId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/product/${productId}`;

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

export const deleteProduct = async (productId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/product/${productId}`;

  return api
    .delete(url, {
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

export const updateProductStatus = async (productId, status) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/product/${productId}`;

  const requestData = {"disable": status};

  return api
    .put(url, requestData, {
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

export const updateProduct = async (productId, productData) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  try {
    const response = await api.put(`/product/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    throw error;
  }
};

export const createProduct = async (productInfo) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.post('/product', productInfo, config);
    console.log(response.data);
    return response.data; // Retorna os dados da resposta para quem chamar esta função
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error; // Lança o erro para quem chamar esta função
  }
};

export const deleteService = async (serviceId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/service/${serviceId}`;

  return api
    .delete(url, {
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

export const getServiceById = async (serviceId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/service/${serviceId}`;

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

export const updateServiceStatus = async (serviceId, status) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const url = `/service/${serviceId}`;

  const requestData = {"disable": status};

  return api
    .put(url, requestData, {
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


export const updateService = async (serviceId, serviceData) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  try {
    const response = await api.put(`/service/${serviceId}`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    throw error;
  }
};

export const createService = async (serviceInfo) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.post('/service', serviceInfo, config);
    console.log(response.data);
    return response.data; // Retorna os dados da resposta para quem chamar esta função
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error; // Lança o erro para quem chamar esta função
  }
};

export const getRatingByBarber = async (id) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  return api
    .get(`/barber/${id}/rating`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    });
};

export const createSale = async (saleInfo) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.post('/sale', saleInfo, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error;
  }
};

export const getScheduleReport = async (startDate, endDate) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token não encontrado na sessionStorage');
  }

  const queryParams = new URLSearchParams({
    startDate,
    endDate,
  }).toString();

  return api
    .get(`/schedule/report?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    });
};