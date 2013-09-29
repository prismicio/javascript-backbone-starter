define([
  'jquery',
  'underscore',
  'backbone',
  'prismic',
  'prismic-helper',
  'prismic-configuration',
  'templates'
], 
function($, _, Backbone, Prismic, Helpers, Configuration, Templates) {

  var AppRouter = Backbone.Router.extend({

    /** Routes **/
    routes: {
      '(~:ref)'                        : 'documents',
      'documents(~:ref)/:id/:slug'     : 'detail',
      'search(~:ref)/*q'               : 'search',

      // OAuth
      'signin'                         : 'signin',
      'auth_callback/#*data'           : 'authCallback'

    },

    /** List all documents **/
    documents: Helpers.prismicRoute(function(ctx) {
      var router = this;
      
      // Submit the `everything` form, using the current ref
      ctx.api.form('everything').ref(ctx.ref).submit(function(results) {

        // Feed the template and update the DOM
        $('#container').html(Templates.DocumentsList({
          docs: results,
          ctx: ctx
        }))

        // Handle Search form
        $('#container form').submit(function(e) {
          e.preventDefault();

          router.navigate(
            'search' + ctx.maybeRefParam + '/' + $('input[name=q]', this).val(),
            {trigger: true}
          );
        })

      });

    }),

    /** Display a document **/
    detail: Helpers.prismicRoute(function(ctx, id, slug) {
      
      // Fetch the document for the given id
      Helpers.getDocument(ctx, id, function(maybeResult) {

        // Feed the template and update the DOM
        $('#container').html(
          maybeResult ? Templates.DocumentDetail({
            doc: maybeResult,
            ctx: ctx
          }) : Templates.NotFound()
        );

      });

    }),

    /** Search documents **/
    search: Helpers.prismicRoute(function(ctx, q) {

      // Submit the `everything` form, using the current ref
      ctx.api.form('everything').ref(ctx.ref).query('[[:d = fulltext(document, "' + q + '")]]').submit(function(results) {

        // Feed the template and update the DOM
        $('#container').html(Templates.SearchResults({
          docs: results,
          ctx: ctx
        }))

      });

    }),

    /** Sigin to preview changes **/
    signin: function() {

      // Retrieve the prismic API
      Helpers.getApiHome(function(Api) {
        document.location =
          Api.data.oauthInitiate + 
          '?response_type=token' +
          '&client_id=' + encodeURIComponent(Configuration['clientId']) +
          '&redirect_uri=' + encodeURIComponent(document.location.href.replace(/#.*/, '') + '#auth_callback/') +
          '&scope=' + encodeURIComponent('master+releases');
      });

    },

    /** OAuth callback **/
    authCallback: function(data) {
      var data = _.chain(data.split('&')).map(function(params) {
          var p = params.split('=');
          return [p[0], decodeURIComponent(p[1])];
        })
        .object()
        .value();

      Helpers.saveAccessTokenInSession(data['access_token']);
      
      // Reload
      document.location = document.location.href.replace(/#.*/, '')
    }

  });

  /** Preview toolbar **/
  var PreviewToolbar = Backbone.View.extend({

    events: {
      "change #selectRef select" :          "changeRef",
      "submit #signout" :                   "signout"
    },

    changeRef: function(e) {
      e.preventDefault();
      var newRef = this.$el.find('select').val();
      document.location = document.location.href.replace(/#.*/, '') + (newRef ? '#~' + newRef : '#');
      document.location.reload();
    },

    signout: function(e) {
      e.preventDefault();
      Helpers.saveAccessTokenInSession(null);
      document.location = document.location.href.replace(/#.*/, '');
    }

  })

  return {
    run: function() {

      var app = new AppRouter();

      /** Called on first route to init the layout **/
      Helpers.setupLayout(app, function(ctx) {

        $('header').html(
          Templates.Header({
            ctx: ctx
          })
        );

        $('footer').html(
          Templates.Footer({
            ctx: ctx
          })
        );

        new PreviewToolbar({ el: $('header') });

      });

      return Backbone.history.start();
    }
  };

});