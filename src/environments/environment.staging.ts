import { environmentVariables as variables } from './enviromentalVariables';

export const environment = {
  production: true,
  api: `${variables.envApi.staging.apiEndPoint}`,
  website_url: `${variables.envApi.staging.checkoutUrl}`,
};
