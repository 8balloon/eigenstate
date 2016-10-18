import Store from './Store/Store'

export default function HeadlessStore(stateDef) {

  const headlessStore = Store(stateDef)
  headlessStore.subscribe((_, triggerEffects) => triggerEffects())

  return headlessStore
}
