export interface ConnectedDispatch extends Dispatch {
  namespace: Namespace;
}

export type Dispatch = (action: any) => void

export type Namespace = string | string[]

interface Dispatchers {
  [key: string]: Dispatch[];
}

const dispatchers: Dispatchers = {}

function getNamespaceDispatchers (namespace: Namespace): Dispatch[] {
  return dispatchers[namespace.toString()] || []
}

function setNamespaceDispatchers (namespace: Namespace, namespaceDispatchers: Dispatch[]): void {
  dispatchers[namespace.toString()] = namespaceDispatchers
}

export function dispatchNamespace (namespace: Namespace): ConnectedDispatch {
  const connectedDispatch = (action: any): void => {
    getNamespaceDispatchers(namespace).forEach((dispatch: Dispatch) => dispatch(action))
  }
  connectedDispatch.namespace = namespace
  return connectedDispatch
}

export function addDispatcher (namespace: Namespace, dispatch: Dispatch): void {
  const namespaceDispatchers = getNamespaceDispatchers(namespace)
  setNamespaceDispatchers(namespace, [...namespaceDispatchers, dispatch])
}

export function removeDispatcher (namespace: Namespace, dispatch: Dispatch): void {
  const namespaceDispatchers = getNamespaceDispatchers(namespace)
  setNamespaceDispatchers(namespace, namespaceDispatchers.filter(d => d !== dispatch))
}

export function resetDispatchers (): void {
  Object.keys(dispatchers).forEach(key => {
    delete dispatchers[key]
  })
}
