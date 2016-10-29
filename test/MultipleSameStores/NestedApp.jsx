import { Store, connect } from '../../src'

const basicStoreDef = {
  num: 0,
  changeNum: () => {
    return { num: Math.random() }
  }
}

const NestableView = (props) => { return (
  <div>
    <div onClick={props.changeNum}>{props.num}</div>
    {props.children}
  </div>
)}

const OuterApp = connect(NestableView, Store(basicStoreDef))
const InnerApp = connect(NestableView, Store(basicStoreDef))
const NestableApp = connect(NestableView, Store(basicStoreDef))

export default () => (
  <div>
    Nested App with different stores, then one with sames:
    <NestableApp>
      <InnerApp />
    </NestableApp>
    <NestableApp>
      <NestableApp />
    </NestableApp>
  </div>
)
