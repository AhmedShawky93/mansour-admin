import { environmentVariables as variables } from './enviromentalVariables';

export const environment = {
  production: true,
  api: `${variables.envApi.prod2.apiEndPoint}`,
  website_url: `${variables.envApi.prod2.checkoutUrl}`,
};
