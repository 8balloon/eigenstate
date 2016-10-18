import { Provider, Store, logVerbosely} from '../../src'

const isMinSize = ({rows, columns}) => rows.length <= 1 || columns.length <= 1

export const gridStore = Store({

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

    if ( !isMinSize(state) ) {

      state.gridClearTick()
      setTimeout(() => state.gridClear(), 100)
    }
  }
})

gridStore.onMethod(logVerbosely)

export const GridView = (props) => {
  return (
    <div id="grid">
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

export default function Grid() {
  return (
    <Provider store={gridStore}>
      <GridView />
    </Provider>
  )
}
