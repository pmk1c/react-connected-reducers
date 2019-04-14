import React, {
  ReactElement,
  createContext,
  useState
} from 'react'
import { Namespace } from '.'

interface NamespaceStates {
  [key: string]: any;
}

type ConnectedContext = {
  getNamespaceState: (namespace: Namespace, state: any) => any;
  setNamespaceState: (namespace: Namespace, state: any) => void;
} | undefined

export const ConnectedContext = createContext<ConnectedContext>(undefined)

interface ConnectedProviderProps {
  children?: any;
}

function ConnectedProvider ({ children }: ConnectedProviderProps): ReactElement {
  const [namespaceStates, setNamespaceStates] = useState<NamespaceStates>({})
  const [connectedContext] = useState<ConnectedContext>({
    getNamespaceState: () => null,
    setNamespaceState: () => null
  })

  if (!connectedContext) {
    throw new Error()
  }

  connectedContext.getNamespaceState = (namespace: Namespace, initialState: any) => {
    if (namespaceStates.hasOwnProperty(namespace)) {
      return namespaceStates[namespace]
    } else {
      return initialState
    }
  }

  connectedContext.setNamespaceState = (namespace: Namespace, state: any) => {
    if (state === namespaceStates[namespace]) {
      return
    }

    setNamespaceStates({
      ...namespaceStates,
      [namespace]: state
    })
  }

  return (
    <ConnectedContext.Provider value={connectedContext}>
      {children}
    </ConnectedContext.Provider>
  )
}

export default ConnectedProvider
