# react-connected-reducers

[![Version](https://img.shields.io/npm/v/react-connected-reducers.svg)](https://www.npmjs.com/package/react-connected-reducers)
[![Downloads](https://img.shields.io/npm/dm/react-connected-reducers.svg)](https://www.npmjs.com/package/react-connected-reducers)
[![Build Status](https://circleci.com/gh/pmk1c/react-connected-reducers.svg?style=svg)](https://circleci.com/gh/pmk1c/react-connected-reducers)

`react-connected-reducers` extends the `useReducer` Hook to allow for components to share their reducer state with each other. If your are not familiar with Hooks or the `useReducer` Hook you should take a look at their [introduction](https://reactjs.org/docs/hooks-intro.html) and the [documentation for state hooks](https://reactjs.org/docs/hooks-state.html). For now this library is an experiment, that tries to enable React developers to connect components more easily, without having to rely on Redux or other state management frameworks.

# Getting started

## Install

```sh
$ npm install --save react-connected-reducers
```

## Usage Example

```javascript
import { ConnectedProvider, useConnectedReducer } from 'react-connected-reducer'

function useTodosReducer () {
  return useConnectedReducer('todos', (state, action) => {
    const { type, payload } = action;

    if (type === 'add') {
      return [...state, payload]
    }

    return state;
  }, [])
}

function TodoList () {
  const [todos] = useTodosReducer()

  return (
    <ul>
      {todos.map(todo => (
        <li>{todo}</li>
      ))}
    </ul>
  )
}

function TodoForm () {
  const [, dispatch] = useTodosReducer()

  let todoEl = useRef(null)

  const addTodo = e => {
    e.preventDefault()
    if (todoEl.current) {
      dispatch({ type: 'add', payload: todoEl.current.value })
      todoEl.current.value = ''
    }
  }

  return (
    <form onSubmit={addTodo}>
      <input ref={todoEl} type="text" />
      <button type="submit">Add todo</button>
    </form>
  )

  function App () {
    return (
      <ConnectedProvider>
        <TodoList />
        <TodoForm />
      </ConnectedProvider>
    )
  }
}
```

This example shows that `useConnectedReducer` works almost exactly like `useReducer`, with two differences:

1. `useConnectedReducer` takes three arguments instead of two. The first one is the namespace. This can either be a `string` or a `string[]`. This namespace has to be unique through your whole application.

1. We wrapped all elements in a `ConnectedProvider`. This component provides the state for all of our namespaces. Components using connected reducers need to be ancestors (not direct children) of a `ConnectedProvider`. To debug the state of your namespaces you can find them in this component i.e. using React Dev Tools.

That's all. Your are now ready to connect your components at ease!

# API

## useConnectedReducer(namespace, reducer, initialState) : [state, dispatch]

### Parameters

> `namespace : string | string[]`
>
> Namespace for this reducer, unique through your whole application.

> `reducer : (state, action) => state`
>
> Function that takes a state and an action and returns a new state.

> `initialState : state`
>
>  The inital state for the reducer.

### Returns

> `state : state`
>
> The current state of the reducer.

> `dispatch : action => void`
>
> Use this function to run an action through this reducer.

# Alternatives

* [Hookleton](https://github.com/bySabi/hookleton) takes a more generalistic approach by providing a way to create hooks and store their logic and return values in memory to share it between components.
