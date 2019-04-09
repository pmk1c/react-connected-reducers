import {
  Dispatch,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  RevisionBumper,
  addBumper,
  bumpNamespace,
  removeBumper
} from './revisionBumpers'
import { ConnectedContext } from './ConnectedProvider'
import { Namespace } from '.'

export default function useConnectedReducer (
  namespace: Namespace,
  reducer: Reducer<any, any>,
  initialState: any
): [any, Dispatch<any>] {
  const connectedContext = useContext(ConnectedContext)

  if (!connectedContext) {
    throw new Error(`
      ConnectedProvider could not be found. You probably tried to use a connected reducer on an element that is not an
      ancestor of a ConnectedProvider. This is not supported anymore.
    `)
  }

  const [revision, setRevision] = useState(0)
  const bumper = useCallback<RevisionBumper>(() => setRevision(revision + 1), [revision])
  useEffect(() => {
    addBumper(namespace, bumper)
    return () => removeBumper(namespace, bumper)
  })

  const state = connectedContext.getNamespaceState(namespace, initialState)
  const dispatch: Dispatch<any> = (action): void => {
    connectedContext.setNamespaceState(namespace, reducer(state, action))
    bumpNamespace(namespace)
  }

  return [state, dispatch]
}
