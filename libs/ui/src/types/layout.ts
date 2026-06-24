export const enum FlexDirection {
  Row = 'row',
  RowReverse = 'row-reverse',
  Column = 'column',
  ColumnReverse = 'column-reverse',
}

export type AlignType = 'start' | 'center' | 'end' | 'stretch' | 'flex-start' | 'flex-end';
export type JustifyType =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';
