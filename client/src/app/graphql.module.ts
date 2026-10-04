import { EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export function provideGraphQL(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideApollo(() => {
      const http = inject(HttpClient);
      const httpLink = new HttpLink(http);

      return {
        link: httpLink.create({ uri: environment.graphqlUri }),
        cache: new InMemoryCache(),
      };
    }),
  ]);
}
