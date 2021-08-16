import { environmentVariables as variables } from './enviromentalVariables';

export const environment = {
  production: true,
  api: `${variables.envApi.prod.apiEndPoint}`,
  website_url: `${variables.envApi.prod.checkoutUrl}`,
};
