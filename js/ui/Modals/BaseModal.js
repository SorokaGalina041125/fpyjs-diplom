/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor(element) {
    this.element = element;
    this.domElement = element ? element[0] : null;
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    if (this.element) {
      this.element.modal('show');
    }
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    if (this.element) {
      this.element.modal('hide');
    }
  }
}