/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 */
class VK {
  static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static lastCallback = () => {};

  /**
   * Получает изображения
   */
  static get(id = '', callback) {
    this.lastCallback = typeof callback === 'function' ? callback : () => {};

    const oldScript = document.getElementById('vk-jsonp-script');
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'vk-jsonp-script';

    const params = new URLSearchParams({
      owner_id: id,
      album_id: 'profile',
      access_token: this.ACCESS_TOKEN,
      callback: 'VK.processData',
      v: '5.131',
    });

    script.src = `https://api.vk.com/method/photos.get?${params.toString()}`;
    document.body.appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    const script = document.getElementById('vk-jsonp-script');
    if (script) {
      script.remove();
    }

    if (!result || result.error) {
      const errorMessage = result?.error?.error_msg || 'Ошибка ответа VK API';
      alert(errorMessage);
      this.lastCallback = () => {};
      return;
    }

    const items = result.response?.items || [];
    const largestImageUrls = items
      .map((item) => {
        const sizes = item.sizes || [];
        if (sizes.length === 0) {
          return null;
        }

        const bestSize = sizes.reduce((max, current) => {
          const maxArea = (max.width || 0) * (max.height || 0);
          const currentArea = (current.width || 0) * (current.height || 0);
          return currentArea > maxArea ? current : max;
        });

        return bestSize.url;
      })
      .filter(Boolean);

    this.lastCallback(largestImageUrls);
    this.lastCallback = () => {};
  }
}