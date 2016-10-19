import Store from './Store'

export default function HeadlessStore(stateDef) {

  const headlessStore = Store(stateDef)
  headlessStore._setEffectingSubscriber((_, triggerEffects) => triggerEffects())

  return headlessStore
}
