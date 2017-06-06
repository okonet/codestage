import { combineReducers } from 'redux';
// import system from './system';
// import job from './job';
// import project from './project';
// import github from './github';
// import settings from './settings';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    system,
    job,
    project,
    github,
    settings,
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      routing,
      form,
    };
  }

  return combineReducers({ ...reducers });
}
