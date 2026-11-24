/**
 * Основная функция для совершения запросов по Yandex API.
 */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  const { method = 'GET', url = '', data, headers = {}, callback = () => {} } = options;

  // Формируем строку запроса из объекта data, если он передан
  let fullUrl = url;
  if (data && typeof data === 'object') {
    const params = Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    if (params.length > 0) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + params;
    }
  }

  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
    // Яндекс.Диск при успешных запросах возвращает статусы 2xx (200, 201, 202, 204)
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(null, xhr.response);
    } else {
      const errorMessage = xhr.response?.message || `Ошибка запроса: статус ${xhr.status}`;
      callback(errorMessage, xhr.response || null);
    }
  });

  xhr.addEventListener('error', () => {
    callback('Сетевая ошибка при выполнении запроса', null);
  });

  try {
    xhr.open(method, fullUrl);

    // Назначаем все заголовки после open() и до send()
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send();
  } catch (err) {
    console.error(err);
    callback(err, null);
  }
};