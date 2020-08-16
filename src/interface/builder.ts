import { StoreSelectModal, IStoreSelectModalHandlers } from './modals/store-select-modal';
import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import * as colors from 'colors';

import { DefaultModal, IDefaultModalHandlers } from './modals/default-modal';
import { SearchModal, ISearchModalHandlers } from './modals/search-modal';


export type GridPosition = [number, number, number, number];
export type TableColumnWidths = number[];
type UITable = any;
type UIBox = blessed.Widgets.BoxElement;
type UILog = blessed.Widgets.Log;


export interface UIBuilder<T, B, L> {
  createTable(label: string, gridPosition: GridPosition, columnWidth: number[]): T;
  createBox(label: string, gridPosition: GridPosition): B;
  createLog(label: string, gridPosition: GridPosition): L;
}


export class MainInterfaceBuilder implements UIBuilder<UITable, UIBox, UILog> {
  private readonly textColor = 'white';
  private readonly labelColor = colors.white;
  private readonly borderColor = 'cyan';
  private readonly scrollBarColor = 'yellow';
  private readonly selectedColor = 'black';
  private readonly selectedBackground = 'cyan';
  private readonly exitKeys = ['escape', 'q', 'C-c'];

  private formatLabel = (text: string) => this.labelColor(text);

  _screen: blessed.Widgets.Screen;
  _grid: contrib.grid;

  get screen(): blessed.Widgets.Screen {
    return this._screen;
  }
  get grid(): contrib.grid {
    return this._grid;
  }

  constructor(title: string) {
    this._screen = this.createScreen(title);
    this._grid = this.createGrid();
    this._screen.key(this.exitKeys, function() {
      this.destroy();
    });
    this._screen.render();
  }

  protected createScreen(title: string): blessed.Widgets.Screen {
    return blessed.screen({
      title,
      dockBorders: true,
      smartCSR: true,
      cursor: {
        artificial: true,
        shape: 'line',
        blink: true,
        color: 'white'
      }
    });
  }

  protected createGrid(): contrib.grid {
    return new contrib.grid({
      screen: this._screen,
      rows: 12,
      cols: 12
    });
  }

  public createBox(label: string, gridPosition: GridPosition): UIBox {
    return this._grid.set(...gridPosition, blessed.box, {
      label: ` ${this.formatLabel(label)} `,
      interactive: true,
      scrollbar: true,
      scrollable: true,
      keys: true,
      vi: true,
      mouse: true,
      tags: true,
      fg: this.textColor,
      padding: 1,
      style: {
        border: {
          fg: this.borderColor
        },
        scrollbar: {
          bg: this.scrollBarColor
        }
      }
    });
  }

  public createTable(label: string, gridPosition: GridPosition, columnWidth: TableColumnWidths): UITable {
    return this._grid.set(...gridPosition, contrib.table, {
      label: ` ${this.formatLabel(label)} `,
      interactive: true,
      scrollBar: true,
      keys: true,
      vi: true,
      mouse: true,
      columnSpacing: 1,
      columnWidth,
      fg: this.textColor,
      selectedFg: this.selectedColor,
      selectedBg: this.selectedBackground,
      style: {
        border: {
          type: 'line',
          fg: this.borderColor
        }
      }
    });
  }

  public createLog(label: string, gridPosition: GridPosition): UILog {
    return this._grid.set(...gridPosition, blessed.log, {
      label: ` ${this.formatLabel(label)} `,
      interactive: true,
      draggable: true,
      scrollbar: true,
      scrollable: true,
      keys: true,
      vi: true,
      tags: true,
      mouse: true,
      style: {
        fg: this.textColor,
        border: {
          type: 'line',
          fg: this.borderColor
        },
        scrollbar: {
          bg: this.scrollBarColor
        },
      }
    });
  }


  /*
   * Modals
   */

  public createDefaultModal(keys: string[], handlers: IDefaultModalHandlers): void {
    this._screen.key(keys, () => new DefaultModal(this._screen, handlers));
  }

  public createSearchModal(keys: string[], handlers: ISearchModalHandlers): void {
    this._screen.key(keys, () => new SearchModal(this._screen, handlers));
  }

  public createStoreSelectModal(keys: string[], handlers: IStoreSelectModalHandlers): void {
    this._screen.key(keys, () => new StoreSelectModal(this._screen, handlers));
  }


  /*
   * Gauge
   */

  public createGauge(label: string, gridPosition: GridPosition): contrib.Widgets.GaugeElement {
    return this._grid.set(...gridPosition, contrib.gauge, {
      label: ` ${this.formatLabel(label)} `,
      stroke: 'green',
      fill: 'white',
      percent: [50]
    });
  }

}
