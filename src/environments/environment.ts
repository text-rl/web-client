export interface IEnvironment {
  production: boolean,
  apiUrl: string,
  webStorageTokenKey: string,
  rememberMeKey: string,
  realTimeConnectionTimeout: number
}

export const environment: IEnvironment = {
  production: false,
  apiUrl: "http://localhost:5000",
  webStorageTokenKey: "token",
  rememberMeKey: "rememberMe",
  realTimeConnectionTimeout: 3600000,
}
