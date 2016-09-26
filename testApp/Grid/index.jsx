import { Provider, logVerbosely} from '../../src'

const stateDef = {
  rows: 'rrr',
  columns: 'ccc',
  addRow: (payload, state) => ({rows: state.rows + 'r'}),
  addColumn: (payload, state) => ({columns: state.columns + 'c'}),
  removeRow: (payload, state) => ({rows: state.rows.slice(0, -1)}),
  removeColumn: (payload, state) => ({columns: state.columns.slice(0, -1)})
}

const Grid = (props) => {
  return (
    <div>
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.addColumn}>Add column</div>
      {
        props.rows.split('').map((rChar, rIdx) => (
          <div key={rIdx}>
            {
              props.columns.split('').map((cChar, cIdx) => (
                cIdx + ':' + rIdx + ' '
              ))
            }
          </div>
        ))
      }
      <div onClick={props.removeRow}>Remove row</div>
      <div onClick={props.removeColumn}>Remove column</div>
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
