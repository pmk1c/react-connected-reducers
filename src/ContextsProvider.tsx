import React, {
  Context,
  ReactElement,
  createContext,
  useState
} from 'react'
import { Namespace } from '.'
import { ConnectedContextState } from './ConnectedProvider'

interface ContextsInterface {
  setState: (state: any) => void;
  state: any;
}

interface ContextsProviderProps {
  children: ReactElement;
  contexts: ConnectedContextState;
}

function ContextsProvider ({ children, contexts }: ContextsProviderProps): ReactElement {
  return Object.values(contexts).reduce<ReactElement>(
    (child: ReactElement, CurrentContext: Context<any>) => (
      <CurrentContext.Provider value={null} >
        {child}
      </CurrentContext.Provider>
    ), children
  )}
}

export default ContextsProvider
