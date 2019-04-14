import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
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

export default function useConnectedReducer<R extends Reducer<any, any>> (
  namespace: Namespace,
  reducer: R,
  initialState: ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
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
  const dispatch: Dispatch<ReducerAction<R>> = (action): void => {
    const newState = reducer(state, action)
    if (state !== newState) {
      connectedContext.setNamespaceState(namespace, newState)
      bumpNamespace(namespace)
    }
  }

  return [state, dispatch]
}
