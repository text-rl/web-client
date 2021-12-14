import {writeFile} from 'fs';

const targetPath = './src/environments/environment.ts';
require('dotenv').config()
const {PRODUCTION, API_URL, WEB_STORAGE_TOKEN_KEY,WEB_STORAGE_API_URL_KEY, REMEMBER_ME_KEY, REAL_TIME_CONNECTION_TIMEOUT} = process.env;
const envConfigFile = `export interface IEnvironment {
  production: boolean,
  apiUrl: string,
  webStorageTokenKey: string,
  webStorageApiUrlKey: string,
  rememberMeKey: string,
  realTimeConnectionTimeout: number
}

export const environment: IEnvironment = {
  webStorageApiUrlKey: ${WEB_STORAGE_API_URL_KEY},
  production: ${PRODUCTION},
  apiUrl: "${API_URL}",
  webStorageTokenKey: "${WEB_STORAGE_TOKEN_KEY}",
  rememberMeKey: "${REMEMBER_ME_KEY}",
  realTimeConnectionTimeout: ${REAL_TIME_CONNECTION_TIMEOUT},
}
`;
console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});
