/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);

    this.content = this.domElement ? this.domElement.querySelector('.scrolling.content') : null;
    this.closeIcon = this.domElement ? this.domElement.querySelector('.header .x.icon') : null;

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения:
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    if (this.closeIcon) {
      this.closeIcon.addEventListener('click', () => this.close());
    }

    if (this.content) {
      this.content.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete');
        if (deleteButton) {
          const path = deleteButton.dataset.path;
          const card = deleteButton.closest('.uploaded-file-card');
          if (!path) {
            return;
          }

          Yandex.removeFile(path, (err) => {
            if (err) {
              console.error(err);
              alert(`Не удалось удалить файл: ${err}`);
              return;
            }

            if (card) {
              card.remove();
            }

            if (this.content && this.content.querySelectorAll('.uploaded-file-card').length === 0) {
              this.content.innerHTML = '<p>Загруженных файлов нет.</p>';
            }
          });
          return;
        }

        const downloadButton = event.target.closest('.download');
        if (downloadButton) {
          const url = downloadButton.dataset.url;
          if (url) {
            Yandex.downloadFileByUrl(url);
          }
        }
      });
    }
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data = []) {
    if (!this.content) {
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      this.content.innerHTML = '<p>Загруженных файлов нет.</p>';
      return;
    }

    this.content.innerHTML = data.map((item) => this.getImageInfo(item)).join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   */
  formatDate(date) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return date || '';
    }

    const datePart = parsedDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const timePart = parsedDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${datePart} в ${timePart}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    const previewSrc = item.preview || item.file || '';
    const fileUrl = item.file || '';
    const path = item.path || '';
    const name = item.name || 'Без имени';
    const createdFormatted = this.formatDate(item.created);
    const sizeKb = typeof item.size === 'number' ? `${(item.size / 1024).toFixed(1)} КБ` : '—';

    return `
      <div class="uploaded-file-card" style="margin-bottom: 1.5rem;">
        <div class="ui segment">
          <div class="ui grid middle aligned">
            <div class="four wide column">
              <img class="ui small image" src="${previewSrc}" alt="${name}">
            </div>
            <div class="eight wide column">
              <table class="ui celled definition table">
                <tbody>
                  <tr>
                    <td>Имя файла</td>
                    <td>${name}</td>
                  </tr>
                  <tr>
                    <td>Дата создания</td>
                    <td>${createdFormatted}</td>
                  </tr>
                  <tr>
                    <td>Размер</td>
                    <td>${sizeKb}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="four wide column right aligned">
              <button class="ui red button delete" type="button" data-path="${path}">Удалить</button>
              <button class="ui green button download" type="button" data-url="${fileUrl}">Скачать</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}