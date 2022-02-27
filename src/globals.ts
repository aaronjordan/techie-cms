const path = require('path');
import { readFileSync } from 'fs';

export type environmentVariables = {
  [key: string]: string;
};

const initGlobals = (): environmentVariables => {
  const envVarsText = readFileSync(path.resolve('techie-meta/app.config'), {
    encoding: 'utf-8',
  });
  const envVars = envVarsText.split('\n').reduce((vars, str) => {
    const pivot = str.indexOf('=');
    const [key, value] = [str.slice(0, pivot), str.slice(pivot + 1)];
    vars[key] = value;
    return vars;
  }, {});
  return Object.freeze(envVars);
};

const AppConfig = initGlobals();

export default AppConfig;
