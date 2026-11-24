/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);

    this.content = this.domElement ? this.domElement.querySelector('.scrolling.content') : null;
    this.closeIcon = this.domElement ? this.domElement.querySelector('.header .x.icon') : null;
    this.closeButton = this.domElement ? this.domElement.querySelector('.actions .close.button') : null;
    this.sendAllButton = this.domElement ? this.domElement.querySelector('.actions .send-all.button') : null;

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения:
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    if (this.closeIcon) {
      this.closeIcon.addEventListener('click', () => this.close());
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    if (this.sendAllButton) {
      this.sendAllButton.addEventListener('click', () => this.sendAllImages());
    }

    if (this.content) {
      this.content.addEventListener('click', (event) => {
        const inputWrapper = event.target.closest('.ui.input');
        if (inputWrapper && inputWrapper.classList.contains('error')) {
          inputWrapper.classList.remove('error');
        }

        const sendButton = event.target.closest('.send-image');
        if (sendButton) {
          const imageContainer = sendButton.closest('.image-preview-container');
          if (imageContainer) {
            this.sendImage(imageContainer);
          }
        }
      });
    }
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images = []) {
    if (!this.content) {
      return;
    }

    this.content.innerHTML = images.map((item) => this.getImageHTML(item)).join('');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
      <div class="image-preview-container" data-url="${item}" style="margin-bottom: 1.25rem;">
        <div class="ui segment">
          <div class="ui grid middle aligned">
            <div class="four wide column">
              <img class="ui small image" src="${item}" alt="Изображение для загрузки">
            </div>
            <div class="eight wide column">
              <div class="ui fluid input">
                <input type="text" placeholder="Введите имя файла (без расширения)">
              </div>
            </div>
            <div class="four wide column right aligned">
              <button class="ui primary button send-image" type="button">Загрузить</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    if (!this.content) {
      return;
    }

    const containers = Array.from(this.content.querySelectorAll('.image-preview-container'));
    containers.forEach((container) => {
      this.sendImage(container);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const input = imageContainer.querySelector('input');
    const inputWrapper = imageContainer.querySelector('.ui.input');
    const url = imageContainer.dataset.url;
    const rawName = input ? input.value.trim() : '';

    if (!rawName) {
      if (inputWrapper) {
        inputWrapper.classList.add('error');
      }
      return;
    }

    if (inputWrapper) {
      inputWrapper.classList.remove('error');
    }

    const hasExtension = /\.[a-zA-Z0-9]+$/.test(rawName);
    const fileName = hasExtension ? rawName : `${rawName}.jpg`;
    const diskPath = `/${fileName}`;

    Yandex.uploadFile(diskPath, url, (err) => {
      if (err) {
        console.error(err);
        alert(`Не удалось загрузить файл "${fileName}": ${err}`);
        return;
      }

      imageContainer.remove();

      if (this.content && this.content.querySelectorAll('.image-preview-container').length === 0) {
        this.close();
      }
    });
  }
}