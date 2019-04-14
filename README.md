# react-connected-reducers

[![Version](https://img.shields.io/npm/v/react-connected-reducers.svg)](https://www.npmjs.com/package/react-connected-reducers)
[![Downloads](https://img.shields.io/npm/dm/react-connected-reducers.svg)](https://www.npmjs.com/package/react-connected-reducers)
[![Build Status](https://circleci.com/gh/pmk1c/react-connected-reducers.svg?style=svg)](https://circleci.com/gh/pmk1c/react-connected-reducers)

`react-connected-reducers` is a library that extends the `useReducer` React Hook to allow for components to share their reducer state with each other. If your are not familiar with React Hooks or the `useReducer` Hook you should take a look at the documentation, which is great. For now this library is more of an experiment, that tries to enable React Developers to connect Components more easily, without having to rely on Redux or other frameworks.

The main difference between this approach and Redux or other Flux libraries is, that there is no shared global application state, but many shared component states. Nevertheless these states can be interconnected by having namespaces for each state and using middlewares to let actions on one reducer dispatch actions on others.

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
        <div>
          <TodoList />
          <TodoForm />
        </div>
      </ConnectedProvider>
    )
  }
}
```

As you can see the `useConnectedReducer` Hook works almost exactly like the `useReducer` Hook, with two main differences:

1. We wrapped all elements in a `ConnectedProvider`. This component provides the state for all of our namespaces. Components using connected reducers need to be ancestors of any `ConnectedProvider`. To debug the state of your namespaces you can find them on this component i.e. using React Dev Tools.

1. `useConnectedReducer` takes three arguments. The first one is the namespace. This can either be a `string` or a `string[]`. This namespace has to be unique through your whole application.

That's all. Your are now ready to connect your components at ease!

# API

## useConnectedReducer(namespace, reducer, initialState) : [state, dispatch]

### Parameters

- `namespace : string | string[]` – Namespace for this reducer, unique through your whole application.
- `reducer : (state, action) => state` – Function that takes a state and an action and returns a new state.
- `initialState : state` – The inital state for the reducer.

### Returns

- `state : state` – The current state of the reducer.
- `dispatch : action => void` – Use this function to run an action through this reducer.
