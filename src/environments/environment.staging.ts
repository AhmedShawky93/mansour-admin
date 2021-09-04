import { environmentVariables as variables } from './enviromentalVariables'

export const environment = {
  production: false,
  api: `${variables.apiEndPoint}`
};
