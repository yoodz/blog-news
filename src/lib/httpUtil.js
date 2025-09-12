// http.js
const BASE_URL = 'https://v.afunny.top:4443';
// const BASE_URL = 'http://localhost:3333';

async function request(endpoint, options = {}) {
  const url = BASE_URL + endpoint;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Request failed:', err);
    throw err;
  }
}

export async function get(endpoint, params = {}, options = {}) {
  const query = new URLSearchParams(params).toString();
  const urlWithParams = query ? `${endpoint}?${query}` : endpoint;

  return request(urlWithParams, {
    method: 'GET',
    ...options,
  });
}

export async function post(endpoint, body = {}, options = {}) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}
