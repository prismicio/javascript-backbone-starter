define(function() {
  
  /** Prismic Configuration **/
  return {

    apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

    // -- Access token if the Master is not open
    // accessToken: 'xxxxxx',

    // OAuth
    // clientId: 'xxxxxx',
    // clientSecret: 'xxxxxx',

    // -- Links resolution rules
    linkResolver: function(ctx, doc) {
      return '#documents' + ctx.maybeRefParam + '/' + doc.id + '/' + doc.slug;
    }

  };

});