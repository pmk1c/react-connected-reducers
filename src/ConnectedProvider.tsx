import React, {
  Context,
  ReactElement,
  createContext,
  useState
} from 'react'
import ContextsProvider from './ContextsProvider'
import { Namespace } from '.'

interface ConnectedContextInterface {
  getContext: (contextName: Namespace) => Context<any> | null;
  setContext: (contextName: Namespace, context: Context<any>) => void;
}

const ConnectedContext = createContext<ConnectedContextInterface>({
  getContext: () => null,
  setContext: () => { }
})

interface ConnectedProviderProps {
  children: ReactElement;
}

function ConnectedProvider ({ children }: ConnectedProviderProps): ReactElement {
  const [contexts, setContexts] = useState<ConnectedContextState>({})

  const getContext = (
    contextName: Namespace
  ): Context<any> => contexts[contextName.toString()]

  const setContext = (
    contextName: Namespace,
    context: Context<any>
  ): void => setContexts({
    ...contexts,
    [contextName.toString()]: context
  })

  const connectedContext = {
    getContext,
    setContext
  }

  return (
    <ConnectedContext.Provider value={connectedContext}>
      <ContextsProvider contexts={contexts}>
        {children}
      </ContextsProvider>
    </ConnectedContext.Provider>
  )
}

export interface ConnectedContextState {
  [key: string]: Context<any>;
}

export default ConnectedProvider
