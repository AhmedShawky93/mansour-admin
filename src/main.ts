import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { environmentVariables } from './environments/enviromentalVariables';


if (environment.production) {
  enableProdMode();
}

var link = document.createElement('link');
link.rel = 'icon';
link.href = `${environmentVariables.brands.favIcon}`;
document.getElementsByTagName('head')[0].appendChild(link);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
