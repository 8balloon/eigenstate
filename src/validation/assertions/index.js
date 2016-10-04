import { isProduction, mapObjectValues } from '../../utils'
import * as assertions from './_assertions'

export default !isProduction ? assertions :
  mapObjectValues(assertions, (assertion) => (() => {}))
