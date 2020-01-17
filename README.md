# Redux-unit

Utility for action creators + reducer generation.

## In action

```ts
// unit.ts
const unit = reduxUnit(initialState, {
  typePrefix: 'TODO',
  prefixSeparator: ':',
  separator: '-',
});

const { actions, reducer } = unit({
  plainAction: identity,
  add: (state, todo: string) => ({ ...state, savedTodos: state.savedTodos.concat(todo) }),
  repeat: (state, todo: string, count: number) => ({
    ...state,
    savedTodos: state.savedTodos.concat(todo.repeat(count))
  }),
  getTodo: makeCommunicationHandler<Date>()({
    field: 'getTodo',
    onSuccess: (dataState, todos: string[]) => ({ ...dataState, todos }),
  }),
});
```

## Project info

###

Use `npm run dev` to start the development server(on port 3000), `npm run build` to build the project.

### Source

* **redux-unit**: Contains all source files + async helpers.

### Example

* **store.ts**: Redux store setup.
* **initial.ts**: Initial state creation.
* **unit.ts**: Action creators/reducer generation with helpers.
* **fatUnit.ts**: Same as above, but without helpers + some other ways to do it.
* **app.ts**: Action creation/dispatch.
