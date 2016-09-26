import { Provider, logVerbosely} from '../../src'

const stateDef = {
  rows: [null, null, null],
  columns: [null, null, null],
  addRow: (payload, state) => ({rows: [].concat(state.rows, [null])}),
  addColumn: (payload, state) => ({columns:[].concat(state.columns, [null])}),
  removeRow: (payload, state) => ({rows: state.rows.slice(0, -1)}),
  removeColumn: (payload, state) => ({columns: state.columns.slice(0, -1)})
}

const Grid = (props) => {
  return (
    <div id="grid">
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.removeRow}>Remove row</div>
      <div onClick={props.addColumn}>Add column</div>
      <div onClick={props.removeColumn}>Remove column</div>
      {
        props.rows.map((_, rowIndex) => (
          <div key={rowIndex}>
          {
            props.columns.map((_, columnIndex) => (
              'r' + rowIndex + 'c' + columnIndex
            )).join(' ')
          }
          </div>
        ))
      }
    </div>
  )
}

export default function GridApp() {
  return (
    <Provider stateDef={stateDef} onEvent={logVerbosely}>
      <Grid />
    </Provider>
  )
}
