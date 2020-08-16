import * as blessed from 'blessed';

import { BaseModal, IBaseModalHandlers } from './base-modal';


export interface IDefaultModalHandlers extends IBaseModalHandlers {
  keypressHandler: (data: any) => void;
}


export class DefaultModal extends BaseModal {
  static readonly modalHeight = 15;

  constructor(screen: blessed.Widgets.Screen, { keypressHandler, closeHandler }: IDefaultModalHandlers) {
    super(screen, <IBaseModalHandlers>{ closeHandler }, DefaultModal.modalHeight);

    let modalForm = this.createModalForm(this._modalBox);
    let textBox1 = this.createTextBox(modalForm, 'Username', 0);
    let textBox2 = this.createTextBox(modalForm, 'Password', 4);
    let submitButton = this.createFormButton(modalForm, 'SUBMIT');

    submitButton.on('press', () => this.destroyModal({
      [textBox1.name]: textBox1.content,
      [textBox2.name]: textBox2.content
    }));

    const bindHandlers = (
      keyPressHandler: (data: any) => void,
      deleteHandler: (data: any) => void,
      enterHandler: (data: any) => void) => {
        textBox1.key('backspace', deleteHandler);
        textBox1.key('enter', enterHandler);
        textBox1.on('keypress', keyPressHandler);
    }

    bindHandlers(
      (event) => {
        keypressHandler(textBox1.content + event);
        this.screen.render();
      },
      (_) => {
        keypressHandler(textBox1.content);
        this.screen.render();
      },
      (_) => {
        textBox2.focus();
        this.screen.render();
      }
    );

    textBox2.key('enter', () => {
      submitButton.focus();
      this.screen.render();
    });

    textBox1.focus();
    this.screen.render();
  }

}
