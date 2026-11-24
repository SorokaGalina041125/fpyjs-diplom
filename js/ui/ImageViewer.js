/**
 * Класс ImageViewer
 * Используется для взаимодействия с блоком изображений
 */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.imagesList = this.element.querySelector('.images-list .ui.grid .row');
    this.previewImage = this.element.querySelector('.column.six.wide img');
    this.selectAllButton = this.element.querySelector('.select-all');
    this.showUploadedButton = this.element.querySelector('.show-uploaded-files');
    this.sendButton = this.element.querySelector('.send');

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображение в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет, у всех ли есть класс активности
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает окно просмотра
   */
  registerEvents() {
    this.imagesList.addEventListener('click', (event) => {
      const img = event.target.closest('img');
      if (!img || !this.imagesList.contains(img)) {
        return;
      }

      img.classList.toggle('selected');
      this.checkButtonText();
    });

    this.imagesList.addEventListener('dblclick', (event) => {
      const img = event.target.closest('img');
      if (!img || !this.imagesList.contains(img)) {
        return;
      }

      if (this.previewImage) {
        this.previewImage.src = img.src;
      }
    });

    this.selectAllButton.addEventListener('click', () => {
      const images = Array.from(this.imagesList.querySelectorAll('img'));
      if (images.length === 0) {
        return;
      }

      const areAllSelected = images.every((img) => img.classList.contains('selected'));
      images.forEach((img) => {
        img.classList.toggle('selected', !areAllSelected);
      });

      this.checkButtonText();
    });

    this.showUploadedButton.addEventListener('click', () => {
      const modal = App.getModal('filePreviewer');
      if (!modal) {
        return;
      }

      if (modal.domElement) {
        const content = modal.domElement.querySelector('.content');
        if (content) {
          content.innerHTML = '<i class="asterisk loading icon massive"></i>';
        }
      }

      modal.open();

      Yandex.getUploadedFiles((err, response) => {
        if (err) {
          console.error(err);
          return;
        }

        const items = response?.items || [];
        modal.showImages(items);
      });
    });

    this.sendButton.addEventListener('click', () => {
      const selectedImages = Array.from(this.imagesList.querySelectorAll('img.selected')).map(
        (img) => img.src
      );
      if (selectedImages.length === 0) {
        return;
      }

      const modal = App.getModal('fileUploader');
      if (!modal) {
        return;
      }

      modal.open();
      modal.showImages(selectedImages);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesList.innerHTML = '';
    this.checkButtonText();
  }

  /**
   * Отрисовывает изображения.
   */
  drawImages(images = []) {
    if (!Array.isArray(images) || images.length === 0) {
      this.checkButtonText();
      return;
    }

    const html = images
      .map(
        (url) => `
          <div class="four wide column">
            <div class="ui fluid image">
              <img src="${url}">
            </div>
          </div>
        `
      )
      .join('');

    this.imagesList.insertAdjacentHTML('beforeend', html);
    this.checkButtonText();
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const images = Array.from(this.imagesList.querySelectorAll('img'));

    if (images.length === 0) {
      this.selectAllButton.textContent = 'Выбрать всё';
      this.selectAllButton.classList.add('disabled');
      this.sendButton.classList.add('disabled');
      return;
    }

    this.selectAllButton.classList.remove('disabled');
    const areAllSelected = images.every((img) => img.classList.contains('selected'));
    this.selectAllButton.textContent = areAllSelected ? 'Снять выделение' : 'Выбрать всё';

    const hasSelected = images.some((img) => img.classList.contains('selected'));
    this.sendButton.classList.toggle('disabled', !hasSelected);
  }
}