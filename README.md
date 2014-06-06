## Backbone.js starter project for prismic.io

This is a blank [BackboneJS](http://backbonejs.org/) project that will connect to any [prismic.io](https://prismic.io) repository, and trivially list its documents. It uses the prismic.io JavaScript development kit, and provides a few helpers to integrate with the Backbone framework.

The project is a single-page application that loads once, and then updates the page DOM to render the website's navigation. It is configured to use hash fragments (`#page`) for the routing, but it's also possible to use standard URLs (`/page`) if you configure your Web server appropriately (ie. serving the index.html page for any incoming URL).

It uses the browser `sessionStorage` to store the access token when you interactively login to preview the future releases of your repository. Therefore, to preview another release than **Master**, a modern browser supporting HTML5 is required.

### Getting started

#### Launch the starter project

Since it's all client-side, you don't need more than a web browser: simply open the `index.html` file in your browser.

If you wish to simulate a client-server architecture anyway, you can also launch a local Web server using the `server.sh` script and open the home page at http://localhost:8000/ (Python is required)

Your starter project is now working! However, by default, it will list and display documents from our "[Les Bonnes Choses](http://lesbonneschoses.prismic.me)" example repository.

#### Configure the starter project

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

To set up the OAuth configuration and interactive signin, go to the _Applications_ panel in your repository's settings, and create a new OAuth application. You simply have to fill in an application name and potentially the callback URL (`localhost` URLs are always authorized, so at development time you can omit to fill in the Callback URL field). After submitting, copy/paste the `clientId` & `clientSecret` tokens into the proper place in your configuration.

### Publish your project

As this application is just made of static files, you can publish it to any web server. One simple way to do that is to use [Github pages](http://pages.github.com/). Just push this Git repository on Github and create a `gh-pages` branch to publish it to your own Github pages:

```
git checkout --orphan gh-pages
git commit -a -m "Push to Github pages"
git push origin gh-pages
```

You can then visit your website at:

**http://_your-github-user_.github.io/_your-github-repository_**.


#### Get started with prismic.io

You can find out [how to get started with prismic.io](https://developers.prismic.io/documentation/UjBaQsuvzdIHvE4D/getting-started) on our [prismic.io developer's portal](https://developers.prismic.io/).

#### Understand the JavaScript development kit

You'll find more information about how to use the development kit included in this starter project, by reading [its README file](https://github.com/prismicio/javascript-kit/blob/master/README.md).

### Specifics and helpers of the Backbone.js starter project

There are several places in this project where you'll be able to find helpful helpers of many kinds. You may want to learn about them in order to know your starter project better, or to take those that you think might be useful to you in order to integrate prismic.io in an existing app.

 * in `js/prismic-configuration.js`:
   * this is where you set you API endpoint and security to access your repository's API;
   * you will also find the linkResolver closure that gets passed around to resolve your links (read more in the last paragraph of our [API documentation](https://developers.prismic.io/documentation/UjBe8bGIJ3EKtgBZ/api-documentation));
   * you will also find the closure that gets executed when the API returns an error.
 * in `js/prismic-helper.js`:
   * the most useful helper is `prismicRoute`, that every controller of a page using prismic.io will start with, and which initializes everything (the Api object, the context, ...). It relies on other functions of internal use: `buildContext`, `getApiHome`, `saveAccessTokenInSession`.
   * `setupLayout` is called in the main `run` function of `app.js`, and sets up the layout (header and footer).
   * and you get a few extra helpers for free to make it easier to perform content queries that tend to come back often: `getDocument(ctx, id, callback)`, `getDocuments(ctx, ids, callback)`, `getBookmark(ctx, bookmark, callback)` (feel free to add yours!)
 * in `js/main.js`:
   * the configuration of require.js
   * and launching the `run()` method, which launches the app
 * in `js/app.js`:
   * you will find the `run()` method (today, it sets the layout up, and starts the Backbone.js app, but you can add stuff that needs to happen when the app starts)
   * the definition of your routes and your controllers:
     * `signin` and `authCallback`, that you shouldn't touch if you wish to use the content release preview feature
     * `documents`, `detail`, `search`, which are here for the example, and that you can replace, or reuse
   * two pre-packaged views: `PreviewToolbar` for the select box that allows to preview content releases, and `SearchEngineForm` for the form to perform searches; you can change them to match your views.
 * in `templates/` and `templates.js`, the pre-packaged templates for this example (that you can replace, or reuse).

### Contribute to the starter project

Contribution is open to all developer levels, read our "[Contribute to the official kits](https://developers.prismic.io/documentation/UszOeAEAANUlwFpp/contribute-to-the-official-kits)" documentation to learn more.

### Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Zengularity (http://www.zengularity.com).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.