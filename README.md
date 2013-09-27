## Starter for single page apps using BackboneJS

This is a blank [BackboneJS](http://backbonejs.org/) project that will connect to any [prismic.io](https://prismic.io) repository. It uses the prismic.io JavaScript developement kit, and provide a few helpers to integrate with the Backbone framework.

It is a single page application that load once, and then update the page DOM to render the website navigation. It is configured to use hash fragments (`#page`) for the routing, but it's also possible to use standard URLs (`/page`) if you configure your Web server appropriatly (ie. serving the index.html page for any incoming URL).

It uses the browser `sessionStorage` to store the access token when you interactively login to preview the future of your repository. Meaning that to preview another release than **Master**, a modern browser supporting HTML5 is required.

## How to start?

Edit the `js/prismic-configuration.js` file to make the application point to the correct repository:

```
var Configuration = {

  // -- API endpoint
  apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // -- OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx'

}
```

Deploy the static files to any Web server. Alternatively you can also launch a local Web server using the `server.sh` script and open the home page at http://localhost:8000/.

### Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Zengularity (http://www.zengularity.com).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.