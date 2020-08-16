import * as blessed from 'blessed';

import { BaseModal, IBaseModalHandlers, IElementPosition, IElementSize } from './base-modal';
import { FuzzySearch } from '../../utils/fuzzy-search';


export interface ISearchModalHandlers extends IBaseModalHandlers {
  keypressHandler: (data: any) => void;
}


export class SearchModal extends BaseModal {
  static readonly modalWidth = 50;
  static readonly modalHeight = 11;

  private _modalForm: blessed.Widgets.FormElement<unknown>;
  private _searchBox: blessed.Widgets.TextElement;

  constructor(screen: blessed.Widgets.Screen, { keypressHandler, closeHandler }: ISearchModalHandlers) {
    super(screen, <IBaseModalHandlers>{ closeHandler }, SearchModal.modalWidth, SearchModal.modalHeight);

    let fuzzySearch = new FuzzySearch();

    this._modalForm = this.createModalForm(this._modalBox);
    this._searchBox = this.createTextBox(this._modalForm, 'Shopify Store', <IElementPosition>{ top: 0 });
    this._searchBox.key('enter', () => {
      searchButton.focus();
      this.screen.render();
    });


    /* Search Box Handlers */

    const bindHandlers = (
      keyPressHandler: (data: any) => any,
      deleteHandler: (data: any) => any,
      enterHandler: (data: any) => any) => {
        this._searchBox.key('backspace', deleteHandler);
        this._searchBox.key('enter', enterHandler);
        this._searchBox.on('keypress', keyPressHandler);
    }

    bindHandlers(
      (event) => { // keyPressHandler
        let results = fuzzySearch.search(this._searchBox.content + event);
        keypressHandler(results);
        this.screen.render();
      },
      (_) => { // deleteHandler
        let results = fuzzySearch.search(this._searchBox.content);
        keypressHandler(results);
        this.screen.render();
      },
      (_) => { // enterHandler
        let results = fuzzySearch.search(this._searchBox.content);
        keypressHandler(results);
        searchButton.focus();
        this.screen.render();
      }
    );

    let searchButton = this.createFormButton(this._modalForm, 'SEARCH', <IElementPosition>{ bottom: 1, left: 0 }, <IElementSize>{ width: '50%-1' });
    searchButton.on('press', () => this.destroyModal({
      [this._searchBox.name]: this._searchBox.content,
    }));

    this._searchBox.focus();
    this.screen.render();
  }

}
