import { Provider, logAction} from '../../src'

const isMinSize = ({rows, columns}) => rows.length <= 1 && columns.length <= 1

const stateDef = {

  //values
  rows: [null, null, null],
  columns: [null, null, null],

  //synchronous methods
  addRow: (_, state) => ({ rows: [].concat(state.rows, [null]) }),
  addColumn: (_, state) => ({ columns:[].concat(state.columns, [null]) }),
  gridClearTick: (_, state) => ({
    rows: state.rows.slice(0, -1),
    columns: state.columns.slice(0, -1)
  }),

  //asyncronous method
  gridClear: (_, state) => {
    state.gridClearTick()
    if ( !isMinSize(state) ) setTimeout(() => state.gridClear(), 100)
  }
}

const Grid = (props) => {
  return (
    <div className="grid">
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.addColumn}>Add column</div>
      <div onClick={props.gridClear}>Clear grid</div>
      { props.rows.map((_, rowIndex) => (
          <div key={rowIndex}>
            { props.columns.map((_, columnIndex) => (
                '(' + rowIndex + ':' + columnIndex + ')'
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
    <Provider stateDef={stateDef} onAction={logAction}
      onUpdate={(state, actions) => {
        console.log("GRID ONUPDATE STATE/ACTIONS:", state, actions)
      }}>
      <Grid />
    </Provider>
  )
}
