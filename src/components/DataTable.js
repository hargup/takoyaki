/**
 * Takoyaki Data Table Component
 * ==============================
 *
 * Component displaying a data table.
 */
import React from 'react';
import cls from 'classnames';
import {replaceSingleCharacter} from './helpers';
import {
  AutoSizer,
  MultiGrid
} from 'react-virtualized';

/**
 * Constants.
 */
const SPACE_REGEX = /\s/g;

/**
 * Main component.
 */
export default function DataTable(props) {
  const {
    data,
    headers
  } = props;

  // Computing column sizes
  const columnSizes = {};

  const indexColumnSize = ('' + data.length).length || 1;

  headers.forEach(header => {
    let max = Math.max(header.length, 1);

    for (let i = 0, l = data.length; i < l; i++) {
      const string = data[i][header];

      if (string) {

        // We must not accept more than 200 characters to remain performant
        const value = Math.min(string.length, 200);

        if (value > max)
          max = value;
      }
    }

    columnSizes[header] = max;
  });

  let totalColumnWidth = indexColumnSize * 9 + 15;

  for (const k in columnSizes)
    totalColumnWidth += columnSizes[k] * 9 + 15;

  const columnWidthSolver = ({index}) => {

    // NOTE: for monospace 14px, the glyph width seems to be ~9px
    if (index === 0)
      return indexColumnSize * 9 + 15;

    return columnSizes[headers[index - 1]] * 9 + 15;
  };

  // Custom cell renderer
  const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    let value;

    if (rowIndex === 0) {
      if (columnIndex === 0)
        value = '#';
      else
        value = headers[columnIndex - 1];
    }
    else {
      if (columnIndex === 0)
        value = rowIndex;
      else
        value = data[rowIndex - 1][headers[columnIndex - 1]];
    }

    // Highlighting empty values
    if (value === '') {
      value = <span className="highlight">.</span>;
    }

    else if (!value) {
      return null;
    }

    else if (columnIndex !== 0 && rowIndex !== 0 && !isNaN(value)) {

      // TODO: numbers with trailing/leading spaces should not go there.
      value = <div className="highlight-number">{value}</div>;
    }

    else if (columnIndex !== 0 && rowIndex !== 0) {
      if (value.length > 200)
        value = value.slice(0, 199) + '…';

      value = replaceSingleCharacter(value, SPACE_REGEX, k => {
        return <span key={k} className="space-indicator">&nbsp;</span>;
      });
    }

    return (
      <div
        key={key}
        className={cls(
          'table-cell',
          rowIndex === 0 && 'header',
          columnIndex === 0 && 'line-number'
        )}
        style={style}>
        {value}
      </div>
    );
  };

  // Rendering the component
  return (
    <AutoSizer disableHeight>
      {({width}) => {
        return (
          <MultiGrid
            fixedRowCount={1}
            fixedColumnCount={1}
            cellRenderer={cellRenderer}
            columnCount={headers.length + 1}
            columnWidth={columnWidthSolver}
            rowCount={data.length + 1}
            rowHeight={30}
            height={500}
            width={Math.min(totalColumnWidth, width)} />
        );
      }}
    </AutoSizer>
  );
}