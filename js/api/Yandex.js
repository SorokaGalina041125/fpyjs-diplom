/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    const storageKey = 'yandexDiskToken';
    let token = localStorage.getItem(storageKey);

    if (!token) {
      const enteredToken = prompt('Введите токен авторизации для Яндекс.Диска:');
      if (enteredToken && enteredToken.trim()) {
        token = enteredToken.trim();
        localStorage.setItem(storageKey, token);
      }
    }

    return token;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload`,
      data: { path, url },
      headers: {
        Authorization: `OAuth ${this.getToken()}`,
      },
      callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback) {
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources`,
      data: { path },
      headers: {
        Authorization: `OAuth ${this.getToken()}`,
      },
      callback,
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files`,
      headers: {
        Authorization: `OAuth ${this.getToken()}`,
      },
      callback,
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.click();
  }
}