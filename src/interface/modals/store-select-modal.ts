import * as blessed from 'blessed';

import { BaseModal, IBaseModalHandlers, IElementPosition, IElementSize } from './base-modal';
import { FuzzySearch } from '../../utils/fuzzy-search';


export interface IStoreSelectModalHandlers extends IBaseModalHandlers {
  keypressHandler: (data: any) => void;
}


export class StoreSelectModal extends BaseModal {
  static readonly modalWidth = 80;
  static readonly modalHeight = 30;

  private _modalForm: blessed.Widgets.FormElement<unknown>;
  private _searchBox: blessed.Widgets.TextElement;
  private _searchResults: any;
  private _infoBox: any;

  constructor(screen: blessed.Widgets.Screen, { keypressHandler, closeHandler }: IStoreSelectModalHandlers) {
    super(screen, <IBaseModalHandlers>{ closeHandler }, StoreSelectModal.modalWidth, StoreSelectModal.modalHeight);

    let fuzzySearch = new FuzzySearch();


    this._modalForm = this.createModalForm(this._modalBox);

    this._searchBox = this.createTextBox(this._modalForm, 'Shopify Store', <IElementPosition>{ top: 0 });
    this._searchBox.key('enter', () => {
      searchButton.focus();
      this.screen.render();
    });

    this._searchResults = this.createLog(
      this._modalForm,
      undefined,
      <IElementPosition>{ top: 3 },
      <IElementSize>{ height: 6 }
    );

    this._infoBox = this.createBox(
      this._modalForm,
      'Info',
      <IElementPosition>{ bottom: 5 },
      <IElementSize>{ height: 13 }
    );

    let searchButton = this.createFormButton(this._modalForm, 'SEARCH',
      <IElementPosition>{ bottom: 1, left: 0 },
      <IElementSize>{ width: '50%-3' }
    );

    searchButton.on('press', () => this.destroyModal({
      [this._searchBox.name]: this._searchBox.content,
    }));

    let cancelButton = this.createFormButton(this._modalForm, 'CANCEL',
      <IElementPosition>{ bottom: 1, right: 0 },
      <IElementSize>{ width: '50%-3' }
    );
    cancelButton.on('press', () => this.destroyModal({
      [this._searchBox.name]: this._searchBox.content,
    }));


    /* Search Box Handlers */

    const bindHandlers = (
      keyPressHandler: (data: any) => any,
      deleteHandler: (data: any) => any,
      enterHandler: (data: any) => any) => {
        this._searchBox.key('backspace', deleteHandler);
        this._searchBox.key('enter', enterHandler);
        this._searchBox.on('keypress', keyPressHandler);
    }

    const logSearchResults = (results: any) => {
      this._searchResults.setText('');
      results = results.map((r: any) => r.website);
      for (let result of results) this._searchResults.log(result);
      this.screen.render();
    }

    bindHandlers(
      (event) => { // keyPressHandler
        let results = fuzzySearch.search(this._searchBox.content + event);
        keypressHandler(results);
        logSearchResults(results);
      },
      (_) => { // deleteHandler
        let results = fuzzySearch.search(this._searchBox.content);
        keypressHandler(results);
        logSearchResults(results);
      },
      (_) => { // enterHandler
        let results = fuzzySearch.search(this._searchBox.content);
        keypressHandler(results);
        searchButton.focus();
        logSearchResults(results);
      }
    );
    

    this._searchBox.focus();
    this.screen.render();
  }

}
