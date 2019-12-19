import { todoActions } from './unit';
import store from './store';

const add = todoActions.add('Test');
const getRequest = todoActions.getTodo.request(new Date());
const getSuccess = todoActions.getTodo.success(['Todo1', 'Todo2']);
const getFailure = todoActions.getTodo.failure('Error');
const getReset = todoActions.getTodo.reset();

const plainType = todoActions.add.getType();
const requestType = todoActions.getTodo.getType('request');
console.log('Raw types:', plainType, requestType);

store.dispatch(add);
store.dispatch(getRequest);
store.dispatch(getSuccess);
store.dispatch(getFailure);
store.dispatch(getReset);

const dispatchers = todoActions.getTodo.mapDispatch(store.dispatch);
dispatchers.request(new Date());
