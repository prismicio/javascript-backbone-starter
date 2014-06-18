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
      '(~:ref)(?p=:page)'              : 'documents',
      'documents(~:ref)/:id/:slug'     : 'detail',
      'search(~:ref)(/p=:page)/*q'               : 'search',

      // OAuth
      'signin'                         : 'signin',
      'auth_callback/#*data'           : 'authCallback'

    },

    /** Setup layout (used in some routes) **/
    setupLayout : _.once(function() {
      Helpers.setupLayout(this, function(ctx) {

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
    }),

    /** List all documents **/
    documents: Helpers.prismicRoute(function(ctx, page) {
      var router = this;

      // Setup the layout
      this.setupLayout();

      page = parseInt(page);

      // Submit the `everything` form, using the current ref
      ctx.api.form('everything').page(page || 1).ref(ctx.ref).submit(function(err, documents) {
        if (err) { Configuration.onPrismicError(err); return; }

        // Feed the template and update the DOM
        $('#container').html(Templates.DocumentsList({
          docs: documents,
          ctx: ctx,
          page: documents.page
        }));

        new PaginationHome({ el: $('#pagination') });

        // Handle Search form
        $('#container form').submit(function(err, e) {
          if (err) { Configuration.onPrismicError(err); return; }
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

      // Setup the layout
      this.setupLayout();
      
      // Fetch the document for the given id
      Helpers.getDocument(ctx, id, function(err, maybeResult) {
        if (err) { Configuration.onPrismicError(err); return; }

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
    search: Helpers.prismicRoute(function(ctx, page, q) {
      page = parseInt(page);

      // Setup the layout
      this.setupLayout();

      // Submit the `everything` form, using the current ref
      ctx.api.form('everything').page(page || 1).ref(ctx.ref).query('[[:d = fulltext(document, "' + q + '")]]').submit(function(err, docs) {
        if (err) { Configuration.onPrismicError(err); return; }

        // Feed the template and update the DOM
        $('#container').html(Templates.SearchResults({
          docs: docs,
          ctx: ctx,
          page: docs.page
        }))

        new PaginationSearch({ el: $('#pagination') });

      });

    }),

    /** Sigin to preview changes **/
    signin: function() {

      // Retrieve the prismic API
      Helpers.getApiHome(function(err, Api) {
        if (err) { Configuration.onPrismicError(err); return; }
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
      "submit #signout" :                   "signout",
      "submit form#searchengine" :          "search"
    },

    changeRef: function(e) {
      e.preventDefault();
      var newRef = this.$el.find('select').val();
      document.location = document.location.href.replace(/#.*/, '') + (newRef ? '#~' + newRef : '#');
    },

    signout: function(e) {
      e.preventDefault();
      Helpers.saveAccessTokenInSession(null);
      document.location = document.location.href.replace(/#.*/, '');
    },

    search: function(e) {
      e.preventDefault();
      var q = this.$el.find('#q').val();
      var maybeRef = this.$el.find('select').length>0 ? this.$el.find('select').val() : null;
      document.location = document.location.href.replace(/#.*/, '') + '#/search'+(maybeRef ? '~'+maybeRef : '')+'/'+q;
    }

  })

  /* View for the pagination that is on the homepage (document list) */
  var PaginationHome = Backbone.View.extend({

    events:{
      "click a" : "changePage"
    },

    changePage: function(e) {
      e.preventDefault();
      var pageParam = '?p='+$(e.target).attr('data-page');
      if (/\?p=[0-9]+/.test(document.location.href)) { // if there's already a known page
        document.location = document.location.href.replace(/\?p=[0-9]+/, pageParam);
      }
      else if (document.location.href.indexOf('#')>-1) { // if there's already a '#'
        document.location = document.location.href+pageParam;
      }
      else { // otherwise
        document.location = document.location.href+'#'+pageParam;
      }
    }

  });

  /* View for the pagination that is on the search result page */
  var PaginationSearch = Backbone.View.extend({

    events:{
      "click a" : "changePage"
    },

    changePage: function(e) {
      e.preventDefault();
      var pageParam = '/p='+$(e.target).attr('data-page')+'/';
      if (/search\/p=[0-9]+\//.test(document.location.href)) { // if there's already a known page
        document.location = document.location.href.replace(/search\/p=[0-9]+\//, 'search'+pageParam);
      }
      else { // otherwise
        document.location = document.location.href.replace(/search\//, 'search'+pageParam);
      }
    }

  });

  return {
    run: function() {

      var app = new AppRouter();

      return Backbone.history.start();
    }
  };

});