# Redux-unit

Utility for action creators + reducer generation.

## In action

```ts
// unit.ts
const unit = reduxUnit(initialState, 'TODO');

const { creators, reducer } = unit({
  add: (state) => (todo: string) => ({ ...state, todos: state.todos.concat(todo) }),
  getTodo: apiHandler({
    communication: 'getTodo',
    onSuccess: (state) => (todos: string[]) => ({ ...state, todos })
  })
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
