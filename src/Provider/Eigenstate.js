import Updater from './Updater'
import StateTree from './StateTree'

export default function Eigenstate(stateDef, executeUpdate, optionalOnInvoke) {

  return StateTree(stateDef, Updater(executeUpdate, optionalOnInvoke))
}
