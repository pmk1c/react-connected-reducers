import {
  ConnectedDispatch,
  Namespace,
  addDispatcher,
  dispatchNamespace,
  removeDispatcher
} from './dispatchers'
import {
  Reducer,
  useEffect,
  useReducer
} from 'react'

export default function useConnectedReducer (
  namespace: Namespace,
  reducer: Reducer<any, any>,
  initialState: any
): [any, ConnectedDispatch] {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    addDispatcher(namespace, dispatch)

    return () => removeDispatcher(namespace, dispatch)
  })

  return [state, dispatchNamespace(namespace)]
}
