import { todoCreators } from './unit';
import store from './store';

const add = todoCreators.add('Test');
const getRequest = todoCreators.getTodo.request();
const getSuccess = todoCreators.getTodo.success(['Todo1', 'Todo2']);
const getFailure = todoCreators.getTodo.failure('Error');
const getReset = todoCreators.getTodo.reset();

store.dispatch(add);
store.dispatch(getRequest);
store.dispatch(getSuccess);
store.dispatch(getFailure);
store.dispatch(getReset);
