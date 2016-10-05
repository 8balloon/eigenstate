import { isProduction, mapObjectValues } from '../../utils'
import * as assertions from './_assertions'

const assert = !isProduction ? assertions :
  mapObjectValues(assertions, (assertion) => (() => {}))

export default assert
