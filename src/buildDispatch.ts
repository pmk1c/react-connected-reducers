import {
  getNamespaceState,
  setNamespaceState
} from './states'
import { Namespace } from '.'
import { Reducer } from 'react'
import { bumpNamespace } from './revisionBumpers'

export type Dispatch = (action: any) => void

export function buildDispatch (namespace: Namespace, reducer: Reducer<any, any>): Dispatch {
  return (action: any): void => {
    const prevState = getNamespaceState(namespace)
    const newState = reducer(prevState, action)
    if (newState !== prevState) {
      setNamespaceState(namespace, newState)
      bumpNamespace(namespace)
    }
  }
}
