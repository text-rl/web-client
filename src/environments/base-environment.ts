import * as _ from 'lodash';

export class BaseEnvironment {
  production = false;
  apiUrl = 'http://localhost:5000';
  webStorageTokenKey = 'token';
  rememberMeKey = 'rememberMe';
  realTimeConnectionTimeout = 60 * 60 * 1000;

  constructor(env?: Partial<BaseEnvironment>) {
    _.assign(this, env);
  }
}
