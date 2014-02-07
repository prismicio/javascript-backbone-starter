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

    // -- To customize: what to do when an error happens on the prismic.io side
    onPrismicError: function(err) {
      alert("An error happened on the server side: "+(err ? '#'+err.message : ''));
    }

  };

});