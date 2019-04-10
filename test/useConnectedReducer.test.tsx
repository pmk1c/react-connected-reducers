import {
  ConnectedProvider,
  useConnectedReducer
} from '../src'
import React, {
  Dispatch,
  ReactElement
} from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { expect } from 'chai'

describe('useConnectedReducer', () => {
  let dispatchAction = (): void => { }
  let useTestReducer = (): [any, Dispatch<any>] => useConnectedReducer(
    'reducer',
    (state: string, action: string): string => {
      return action === 'action' ? 'newState' : state
    },
    'state'
  )
  let ComponentWithStateAndDispatch = (): ReactElement => {
    const [state, dispatch] = useTestReducer()
    dispatchAction = () => dispatch('action')
    return <>{state}</>
  }
  let ComponentWithState = (): ReactElement => {
    const [state] = useTestReducer()
    return <>{state}</>
  }

  describe('single component', () => {
    it('returns initial state to component', () => {
      const renderer = ReactTestRenderer.create(
        <ConnectedProvider>
          <ComponentWithState />
        </ConnectedProvider>
      )

      expect(renderer.toJSON()).to.equal('state')
    })

    it('dispatches action through reducer and updates component state', () => {
      const app = (
        <ConnectedProvider>
          <ComponentWithStateAndDispatch />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(renderer.toJSON()).to.equal('state')

      dispatchAction()
      renderer.update(app)

      expect(renderer.toJSON()).to.equal('newState')
    })
  })

  describe('multiple components', () => {
    it('updates all connected components when dispatching an action', () => {
      const app = (
        <ConnectedProvider>
          <ComponentWithState />
          <ComponentWithStateAndDispatch />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(renderer.toJSON()).to.eql(['state', 'state'])

      dispatchAction()
      renderer.update(app)

      expect(renderer.toJSON()).to.eql(['newState', 'newState'])
    })
  })
})
