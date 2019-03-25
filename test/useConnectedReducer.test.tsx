import React, {
  ReactElement,
  useEffect
} from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { expect } from 'chai'
import { resetBumpers } from '../src/revisionBumpers'
import { resetStates } from '../src/states'
import { useConnectedReducer } from '../src'

describe('useConnectedReducer', () => {
  afterEach(() => {
    resetBumpers()
    resetStates()
  })

  describe('single component', () => {
    it('returns initial state to component', () => {
      const reducer = (state: string): string => {
        return state
      }
      function Component (): ReactElement {
        const [state] = useConnectedReducer('reducer', reducer, 'state')
        return <>{state}</>
      }
      const renderer = ReactTestRenderer.create(<Component />)

      expect(renderer.toJSON()).to.equal('state')
    })

    it('dispatches action through reducer and updates component state', () => {
      const reducer = (state: string, action: string): string => {
        return action === 'action' ? 'newState' : state
      }
      function Component (): ReactElement {
        const [state, dispatch] = useConnectedReducer('reducer', reducer, 'state')
        useEffect(() => {
          dispatch('action')
        })
        return <>{state}</>
      }
      const app = <Component />
      const renderer = ReactTestRenderer.create(app)

      expect(renderer.toJSON()).to.equal('state')

      renderer.update(app)

      expect(renderer.toJSON()).to.equal('newState')
    })
  })

  describe('multiple components', () => {
    it('updates all connected components when dispatching an action', () => {
      const useMyReducer = (): [string, (action: string) => void] => useConnectedReducer(
        'reducer',
        (state: string, action: string): string => {
          return action === 'action' ? 'newState' : state
        },
        'state'
      )
      function ComponentA (): ReactElement {
        const [state] = useMyReducer()
        return <>{state}</>
      }
      function ComponentB (): ReactElement {
        const [state, dispatch] = useMyReducer()
        useEffect(() => {
          dispatch('action')
        })
        return <>{state}</>
      }
      const app = (
        <>
          <ComponentA />
          <ComponentB />
        </>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(renderer.toJSON()).to.eql(['state', 'state'])

      renderer.update(app)

      expect(renderer.toJSON()).to.eql(['newState', 'newState'])
    })

    it('updates all connected components when dispatching an action and dispatch happens before mount', () => {
      const useMyReducer = (): [string, (action: string) => void] => useConnectedReducer(
        'reducer',
        (state: string, action: string): string => {
          return action === 'action' ? 'newState' : state
        },
        'state'
      )
      function ComponentA (): ReactElement {
        const [state, dispatch] = useMyReducer()
        useEffect(() => {
          dispatch('action')
        })
        return <>{state}</>
      }
      function ComponentB (): ReactElement {
        const [state] = useMyReducer()
        return <>{state}</>
      }
      const app = (
        <>
          <ComponentA />
          <ComponentB />
        </>
      )
      const renderer = ReactTestRenderer.create(app)

      expect(renderer.toJSON()).to.eql(['state', 'state'])

      renderer.update(app)

      expect(renderer.toJSON()).to.eql(['newState', 'newState'])
    })
  })
})
