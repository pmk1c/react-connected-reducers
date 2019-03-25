import { Namespace } from '.'

interface States {
  [key: string]: any[];
}

const states: States = {}

export function getNamespaceState (namespace: Namespace): any {
  return states[namespace.toString()]
}

export function setNamespaceState (namespace: Namespace, namespaceState: any): void {
  states[namespace.toString()] = namespaceState
}

export function hasNamespaceState (namespace: Namespace): boolean {
  return states.hasOwnProperty(namespace.toString())
}

export function resetStates (): void {
  Object.keys(states).forEach(key => {
    delete states[key]
  })
}
