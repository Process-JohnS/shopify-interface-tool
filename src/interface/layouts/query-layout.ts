import { ISearchModalHandlers } from './../modals/search-modal';
import { MainInterfaceBuilder, GridPosition, TableColumnWidths } from '../builder';

import * as colors from 'colors';


export class QueryLayout {
  private _uiBuilder: MainInterfaceBuilder;


  constructor(title: string) {
    this._uiBuilder = new MainInterfaceBuilder(title);


    // Table
    let table1 = this._uiBuilder.createTable(
      'List',
      <GridPosition>[0, 0, 6, 12],
      <TableColumnWidths>[20, 40]
    );
    let data = [];
    for (let i = 0; i < 100; i++) {
      data.push([`Line: ${i}`, `${i % 4 ? true : false}`]);
    }
    table1.setData({ headers: ['Info', 'Status'], data });


    // Log
    let log1 = this._uiBuilder.createLog(
      'Log',
      <GridPosition>[6, 4, 6, 8]
    );
    for (let i = 0; i < 100; i++) {
      log1.log(`Log: ${i}`);
    }


    // Box
    let box1 = this._uiBuilder.createBox(
      'Summary',
      <GridPosition>[6, 0, 6, 4]
    );
    let customerCount = 10;
    let box1Content = 
    `{#6a6a6a-fg}Customer count:{/#6a6a6a-fg} ${customerCount}\n` +
    `{#6a6a6a-fg}Last Updated:{/#6a6a6a-fg} 24 Aug 2020`;
    box1.setContent(`{white-fg}${box1Content}{/white-fg}`);


    // Search Modal
    this._uiBuilder.createSearchModal(['s'], <ISearchModalHandlers>{

      keypressHandler: (data) => {
        log1.setContent(``);
        log1.setScroll(0);
        log1.log(data);
      },

      closeHandler: (data) => {
        log1.setContent(``);
        log1.setScroll(0);
        log1.log(data);

        if (!isNaN(data['Shopify Store'])) {
          gauge1.setPercent(data['Shopify Store']);
        } else {
          log1.setContent(``);
          log1.log(`${colors.red.bold('Error:')} Number Format Exception`);
          gauge1.setPercent(0);
        }
      }

    });



    // Gauge
    let gauge1 = this._uiBuilder.createGauge(
      'Download Status',
      <GridPosition>[10, 0, 2, 4]
    );


  }

}
