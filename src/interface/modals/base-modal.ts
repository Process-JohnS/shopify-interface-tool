import * as blessed from 'blessed';
import * as colors from 'colors';


export interface IBaseModalHandlers {
  closeHandler: (data: any) => void;
}

export type IElementPosition = {
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
}
export type IElementSize = {
  width?: number|string,
  height?: number
}


export class BaseModal {

  protected readonly borderColor = 'yellow';
  protected readonly labelColor = colors.white;
  protected formatLabel = (text: string) => this.labelColor(text);
  protected readonly modalBackground = 'gray';


  /* Modal Dimensions */

  protected readonly defaultModalBoxHeight = 15;
  protected readonly defaultModalBoxWidth = 50;

  protected readonly modalBoxPadding = 1;

  protected modalBoxHeight = this.defaultModalBoxHeight;
  protected modalBoxWidth = this.defaultModalBoxWidth;

  protected modalWidth = this.modalBoxWidth - this.modalBoxPadding * 2;
  protected modalHeight = this.modalBoxHeight - this.modalBoxPadding * 2;
  protected readonly modalVerticalPadding = 1;
  protected readonly modalHorizontalPadding = 2;
  protected readonly modalPadding = {
    top: this.modalVerticalPadding,
    right: this.modalHorizontalPadding,
    bottom: 0,
    left: this.modalHorizontalPadding
  };

  protected modalContentWidth = this.modalWidth - (this.modalPadding.left + this.modalPadding.right);


  /* Button States */

  protected readonly buttonColor = 'white';
  protected readonly buttonBackground = 'yellow';

  protected readonly buttonFocusColor = 'black';
  protected readonly buttonFocusBackground = 'white';

  protected readonly buttonHoverColor = 'black';
  protected readonly buttonHoverBackground = 'white';

  protected setModalBoxWidth(modalBoxWidth: number) {
    this.modalBoxWidth = modalBoxWidth;
    this.modalWidth = this.modalBoxWidth - this.modalBoxPadding * 2
    this.modalContentWidth = this.modalWidth - (this.modalPadding.left + this.modalPadding.right);
  }

  protected setModalBoxHeight(modalBoxHeight: number) {
    this.modalBoxHeight = modalBoxHeight;
    this.modalHeight = this.modalBoxHeight - this.modalBoxPadding * 2
  }

  _modalBox: any;
  closeHandler: (data: any) => void;

  constructor(protected screen: any, handlers: IBaseModalHandlers, modalBoxWidth?: number, modalBoxHeight?: number) {
    if (modalBoxWidth) this.setModalBoxWidth(modalBoxWidth);
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

  protected createLog(
    form: blessed.Widgets.Node,
    label: string,
    position: IElementPosition = { top: 1 },
    size: IElementSize = { width: this.modalContentWidth, height: 3 }): any
  {
    return blessed.log({
      parent: form,
      label: label ? ` ${this.formatLabel(label)} ` : '',
      interactive: false,
      draggable: false,
      padding: { top: 0, right: 1, bottom: 0, left: 1 },
      // scrollbar: true,
      scrollable: true,
      keys: false,
      vi: false,
      tags: true,
      mouse: false,
      ...position,
      ...size,
      border: { type: 'line' },
      style: {
        border: {
          fg: 'black'
        },
        focus: {
          fg: this.buttonFocusColor,
        },
      }
    });
  }

  protected createBox(
    form: blessed.Widgets.Node,
    label: string,
    position: IElementPosition = { top: 1 },
    size: IElementSize = { width: this.modalContentWidth, height: 3 }
    ): blessed.Widgets.BoxElement
  {
    return blessed.box({
      parent: form,
      label: ` ${this.formatLabel(label)} `,
      interactive: false,
      // scrollbar: true,
      scrollable: true,
      keys: false,
      vi: false,
      mouse: false,
      tags: true,
      padding: 1,
      ...position,
      ...size,
      border: { type: 'line' },
      style: {
        border: {
          fg: 'black'
        },
        focus: {
          fg: this.buttonFocusColor,
        },
      }
    });
  }

  protected createTextBox(
    form: blessed.Widgets.Node,
    label: string,
    position: IElementPosition = { top: 1 },
    size: IElementSize = { width: this.modalContentWidth, height: 3 }): blessed.Widgets.TextboxElement
  {
    return blessed.textbox({
      label: ` ${this.formatLabel(label)} `,
      name: label,
      parent: form,
      ...position,
      ...size,
      tags: true,
      keys: true,
      inputOnFocus: true,
      border: { type: 'line' },
      style: {
        focus: { border: { fg: 'white' } },
        border: { fg: 'yellow' },
      }
    });
  }

  protected createFormButton(
    form: blessed.Widgets.Node,
    label: string,
    position: IElementPosition = { bottom: 1 },
    size: IElementSize = { width: this.modalContentWidth })
  {
    return blessed.button({
      parent: form,
      mouse: true,
      keys: true,
      shrink: true,
      ...position,
      ...size,
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
