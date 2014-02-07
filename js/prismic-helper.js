define([
  'underscore',
  'prismic',
  'prismic-configuration'
], function(_, Prismic, Configuration) {

  var Helpers = {

    setupLayout: function(Router, setup) {
      Router.once('route', function(e) {
        var maybeRef = _.chain( /^[^~]*~([^\/]+).*$/.exec(document.location.hash) || [] ).rest().first().value();
        Helpers.buildContext(maybeRef, function(ctx) {
          setup(ctx);
        });
      });
    },

    saveAccessTokenInSession: function(token) {
      if(token) {
        sessionStorage.setItem('ACCESS_TOKEN', token);
      } else {
        sessionStorage.removeItem('ACCESS_TOKEN');
      }
    },

    getApiHome: function(callback) {
      Prismic.Api(Configuration.apiEndpoint, callback, sessionStorage.getItem('ACCESS_TOKEN'));
    },

    buildContext: function(ref, callback) {
      // retrieve the API
      Helpers.getApiHome(function(api) {
        var ctx = {
          ref: (ref || api.data.master.ref),
          api: api,
          maybeRefParam: (ref && ref != api.data.master.ref ? '~' + ref : ''),
          
          oauth: function() {
            var token = sessionStorage.getItem('ACCESS_TOKEN');
            return {
              accessToken: token,
              hasPrivilegedAccess: !!token
            }
          },

          linkResolver: function(ctx, doc) {
            return Configuration.linkResolver(ctx, doc);
          }
        }
        callback(ctx);
      });
    },

    prismicRoute: function(routeF) {
      return function() {
        // first argument is optional ref
        var self = this,
            ref = _.first(arguments),
            args = _.rest(arguments)

        Helpers.buildContext(ref, function(ctx) {
          // Call the original function with the Context as first parameter
          routeF.apply(self, _.flatten([ctx, args]));
        });

      }
    },

    getDocument: function(ctx, id, callback) {
      ctx.api.forms('everything').ref(ctx.ref).query('[[:d = at(document.id, "' + id + '")]]').submit(function(results) {
        callback(_.first(results));
      });
    },

    getDocuments: function(ctx, ids, callback) {
      if(ids && ids.length) {
        ctx.api.forms('everything').ref(ctx.ref).query('[[:d = any(document.id, [' + _(ids).map(function(id) { return '"' + id + '"';}).join(',') + '])]]').submit(function(results) {
          callback(results);
        });
      } else {
        callback([]);
      }
    },

    getBookmark: function(ctx, bookmark, callback) {
      var id = ctx.api.bookmarks[bookmark];
      if(id) {
        this.getDocument(ctx, id, callback);
      } else {
        callback();
      }
    }

  };

  return Helpers;

})