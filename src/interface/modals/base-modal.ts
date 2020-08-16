import * as blessed from 'blessed';
import * as colors from 'colors';


export interface IBaseModalHandlers {
  closeHandler: (data: any) => void;
}


export class BaseModal {

  protected readonly borderColor = 'yellow';
  protected readonly labelColor = colors.white;
  protected formatLabel = (text: string) => this.labelColor(text);
  protected readonly modalBackground = 'gray';


  /* Modal Dimensions */

  protected readonly defaultModalBoxHeight = 15;
  protected modalBoxHeight = this.defaultModalBoxHeight;

  protected readonly modalBoxWidth = 50;
  protected readonly modalBoxPadding = 1;

  protected readonly modalWidth = this.modalBoxWidth - this.modalBoxPadding * 2;
  protected modalHeight = this.modalBoxHeight - this.modalBoxPadding * 2;
  protected readonly modalVerticalPadding = 1;
  protected readonly modalHorizontalPadding = 2;
  protected readonly modalPadding = {
    top: this.modalVerticalPadding,
    right: this.modalHorizontalPadding,
    bottom: 0,
    left: this.modalHorizontalPadding
  };

  protected readonly modalContentWidth = this.modalWidth - (this.modalPadding.left + this.modalPadding.right);


  /* Button States */

  protected readonly buttonColor = 'black';
  protected readonly buttonBackground = 'cyan';

  protected readonly buttonFocusColor = 'white';
  protected readonly buttonFocusBackground = 'blue';

  protected readonly buttonHoverColor = 'white';
  protected readonly buttonHoverBackground = 'blue';

  protected setModalBoxHeight(modalBoxHeight: number) {
    this.modalBoxHeight = modalBoxHeight;
    this.modalHeight = this.modalBoxHeight - this.modalBoxPadding * 2
  }

  _modalBox: any;
  closeHandler: (data: any) => void;

  constructor(protected screen: any, handlers: IBaseModalHandlers, modalBoxHeight?: number) {
    if (modalBoxHeight) this.setModalBoxHeight(modalBoxHeight);
    this.closeHandler = handlers.closeHandler;
    this._modalBox = this.createModalBox();
  }

  protected destroyModal(data: any) {
    this._modalBox.destroy();
    this.closeHandler(data);
    this.screen.render();
  }

  protected createModalBox() {
    return blessed.layout({
      draggable: true,
      layout: 'inline',
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: this.modalBoxWidth,
      height: this.modalBoxHeight,
      border: 'line',
      style: {
        border: {
          fg: this.borderColor
        }
      }
    });
  }

  protected createModalForm(modalBox: blessed.Widgets.Node) {
    return blessed.form({
      parent: modalBox,
      mouse: true,
      keys: true,
      type: 'overlay',
      width: this.modalWidth,
      height: this.modalHeight,
      padding: this.modalPadding,
      bg: this.modalBackground,
    });
  }

  protected createTextBox(form: blessed.Widgets.Node, label: string, top: number) {
    return blessed.textbox({
      label: ` ${this.formatLabel(label)} `,
      name: label,
      parent: form,
      top: top,
      tags: true,
      keys: true,
      inputOnFocus: true,
      border: { type: 'line' },
      width: this.modalContentWidth,
      height: 3,
      style: {
        focus: { border: { fg: 'blue' } },
        border: { fg: 'cyan' },
      }
    });
  }

  protected createFormButton(form: blessed.Widgets.Node, label: string) {
    return blessed.button({
      parent: form,
      mouse: true,
      keys: true,
      shrink: true,
      width: this.modalContentWidth,
      bottom: 1,
      name: label,
      content: label,
      padding: { left: 2, right: 2, top: 1, bottom: 1 },
      style: {
        bg: this.buttonBackground,
        fg: this.buttonColor,
        focus: {
          fg: this.buttonFocusColor,
          bg: this.buttonFocusBackground
        },
        hover: {
          fg: this.buttonHoverColor,
          bg: this.buttonHoverBackground
        }
      }
    });
  }

}
