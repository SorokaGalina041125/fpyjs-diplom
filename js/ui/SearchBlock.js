/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.input = this.element.querySelector('input');
    this.replaceButton = this.element.querySelector('.replace');
    this.addButton = this.element.querySelector('.add');

    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.replaceButton.addEventListener('click', () => {
      const userId = this.input.value.trim();
      if (!userId) {
        return;
      }

      VK.get(userId, (images) => {
        App.imageViewer.clear();
        App.imageViewer.drawImages(images);
      });
    });

    this.addButton.addEventListener('click', () => {
      const userId = this.input.value.trim();
      if (!userId) {
        return;
      }

      VK.get(userId, (images) => {
        App.imageViewer.drawImages(images);
      });
    });
  }
}