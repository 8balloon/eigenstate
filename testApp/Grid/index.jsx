import { Provider, logVerbosely} from '../../src'

const stateDef = {

  //values
  rows: [null, null, null],
  columns: [null, null, null],
  gridClearIntervalID: null,

  //synchronous methods
  addRow: (_, state) => ({ rows: [].concat(state.rows, [null]) }),
  addColumn: (_, state) => ({ columns:[].concat(state.columns, [null]) }),
  removeRow: (_, state) => ({ rows: state.rows.slice(0, -1) }),
  removeColumn: (_, state) => ({ columns: state.columns.slice(0, -1) }),
  setGridClearIntervalID: (intervalID, state) => ({ intervalID: intervalID }),

  clearActiveGridClearInterval: (_, state) => { clearInterval(state.intervalID) },

  //asyncronous methods
  clearActiveGridClearIntervalIfEmpty: (_, state) => {
    state.rows.length || state.columns.length || state.clearActiveGridClearInterval()
  },
  gridClearTick: (_, state) => {
    state.removeRow()
    state.removeColumn()
  },
  startGridClear: (_, state) => {
    state.clearActiveGridClearInterval()

    const intervalID = setInterval(() => {
      state.gridClearTick()
      state.clearActiveGridClearIntervalIfEmpty()
    }, 100)
    state.setGridClearIntervalID(intervalID)
  }
}

const Grid = (props) => {
  return (
    <div className="grid">
      <div onClick={props.addRow}>Add row</div>
      <div onClick={props.addColumn}>Add column</div>
      <div onClick={props.startGridClear}>Clear grid</div>
      {
        props.rows.map((_, rowIndex) => (
          <div key={rowIndex}>
          {
            props.columns.map((_, columnIndex) => (
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
    <Provider stateDef={stateDef} onAction={logVerbosely}>
      <Grid />
    </Provider>
  )
}
