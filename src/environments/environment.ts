import { environmentVariables as variables } from './enviromentalVariables'

export const environment = {
  production: false,
  api: `${variables.envApi.env.apiEndPoint}`,
  website_url: `${variables.envApi.env.apiEndPoint}`,
};
