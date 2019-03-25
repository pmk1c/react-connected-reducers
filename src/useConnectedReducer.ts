import {
  Dispatch,
  buildDispatch
} from './buildDispatch'
import {
  Reducer,
  useEffect,
  useState
} from 'react'
import {
  addBumper,
  hasRevisionBumper,
  removeBumper
} from './revisionBumpers'
import {
  getNamespaceState,
  hasNamespaceState,
  setNamespaceState
} from './states'
import { Namespace } from '.'

function initializeNamespaceState (namespace: Namespace, initialState: any): void {
  if (!hasNamespaceState(namespace)) {
    setNamespaceState(namespace, initialState)
  }
}

function useRevisionBumper (namespace: Namespace): void {
  const [revision, setRevision] = useState(0)
  const revisionBumper = (): void => setRevision(revision + 1)

  if (!hasRevisionBumper(namespace, revisionBumper)) {
    addBumper(namespace, revisionBumper)
  }
  useEffect(() => {
    return () => removeBumper(namespace, revisionBumper)
  })
}

export default function useConnectedReducer (
  namespace: Namespace,
  reducer: Reducer<any, any>,
  initialState: any
): [any, Dispatch] {
  initializeNamespaceState(namespace, initialState)
  useRevisionBumper(namespace)

  return [getNamespaceState(namespace), buildDispatch(namespace, reducer)]
}
