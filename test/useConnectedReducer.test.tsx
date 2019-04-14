/* eslint-disable no-unused-expressions */
import './config'

import {
  ConnectedProvider,
  useConnectedReducer
} from '../src'
import React, {
  Dispatch,
  ReactElement
} from 'react'
import {
  __getRevisionBumpers,
  __resetRevisionBumpers
} from '../src/revisionBumpers';
import {
  expect,
  spy
} from 'chai'
import ReactTestRenderer from 'react-test-renderer'

describe('useConnectedReducer', () => {
  let dispatchAction: (action?: string) => void
  let ComponentWithStateAndDispatchSpy: () => ReactElement
  let ComponentWithStateSpy: () => ReactElement
  let UnconnectedComponentSpy: () => ReactElement

  const useTestReducer = (): [any, Dispatch<any>] => useConnectedReducer(
    'reducer',
    (state: string, action: string): string => {
      return action === 'action' ? 'newState' : state
    },
    'state'
  )
  const ComponentWithStateAndDispatch = (): ReactElement => {
    const [state, dispatch] = useTestReducer()
    dispatchAction = action => dispatch(action || 'action')
    return <>{state}</>
  }
  const ComponentWithState = (): ReactElement => {
    const [state] = useTestReducer()
    return <>{state}</>
  }
  const UnconnectedComponent = (): ReactElement => {
    return <>unconnected</>
  }

  beforeEach(() => {
    ComponentWithStateSpy = spy(ComponentWithState)
    ComponentWithStateAndDispatchSpy = spy(ComponentWithStateAndDispatch)
    UnconnectedComponentSpy = spy(UnconnectedComponent)

    __resetRevisionBumpers()
  })

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

    it('does not leak revision bumpers on re-render', () => {
      const revisionBumpers = __getRevisionBumpers()
      const app = (
        <ConnectedProvider>
          <ComponentWithStateAndDispatch />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)
      renderer.update(app)

      expect(revisionBumpers).to.have.key('reducer')
      expect(revisionBumpers.reducer).to.have.length(1)

      const prevBumper = revisionBumpers.reducer[0]
      dispatchAction()
      renderer.update(app)

      expect(revisionBumpers).to.have.key('reducer')
      expect(revisionBumpers.reducer).to.have.length(1)
      expect(revisionBumpers.reducer[0]).not.to.equal(prevBumper)
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

    it('re-renders connected components once when state has been changed', () => {
      const app = (
        <ConnectedProvider>
          <ComponentWithStateSpy />
          <ComponentWithStateAndDispatchSpy />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(ComponentWithStateSpy).to.have.been.called.once
      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.once

      dispatchAction()
      renderer.update(app)

      expect(ComponentWithStateSpy).to.have.been.called.twice
      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.twice
    })

    it('does not re-render connected components when state has not been changed', () => {
      const app = (
        <ConnectedProvider>
          <ComponentWithStateSpy />
          <ComponentWithStateAndDispatchSpy />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(ComponentWithStateSpy).to.have.been.called.once
      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.once

      dispatchAction('does-not-change-anything')
      renderer.update(app)

      expect(ComponentWithStateSpy).to.have.been.called.once
      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.once
    })

    it('does not re-render unconnected components on dispatch', () => {
      const app = (
        <ConnectedProvider>
          <ComponentWithStateAndDispatchSpy />
          <UnconnectedComponentSpy />
        </ConnectedProvider>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.once
      expect(UnconnectedComponentSpy).to.have.been.called.once

      dispatchAction()
      renderer.update(app)

      expect(ComponentWithStateAndDispatchSpy).to.have.been.called.twice
      expect(UnconnectedComponentSpy).to.have.been.called.once

    })
  })
})
