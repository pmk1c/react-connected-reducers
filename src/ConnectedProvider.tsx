import React, {
  ReactElement,
  ReactNode,
  createContext,
  useState
} from 'react'
import { Namespace } from '.'

interface NamespaceStates {
  [key: string]: any;
}

type ConnectedContext = {
  getNamespaceState: (namespace: Namespace, initialState: any) => any;
  setNamespaceState: (namespace: Namespace, state: any) => void;
} | undefined

export const ConnectedContext = createContext<ConnectedContext>(undefined)

interface ConnectedProviderProps {
  children?: ReactNode;
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
    const ns = namespace.toString()
    if (namespaceStates.hasOwnProperty(ns)) {
      return namespaceStates[ns]
    } else {
      return initialState
    }
  }

  connectedContext.setNamespaceState = (namespace: Namespace, state: any) => {
    const ns = namespace.toString()
    if (state === namespaceStates[ns]) {
      return
    }

    setNamespaceStates({
      ...namespaceStates,
      [ns]: state
    })
  }

  return (
    <ConnectedContext.Provider value={connectedContext}>
      {children}
    </ConnectedContext.Provider>
  )
}

export default ConnectedProvider
