require.config({

  paths: {
    jquery: 'vendor/jquery-2.0.3.min',
    underscore: 'vendor/underscore-1.5.2.min',
    backbone: 'vendor/backbone-1.0.0.min',
    prismic: 'vendor/prismic.io-1.0.12.min',
    text: 'vendor/text-0.27.0.min'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    prismic: {
      exports: 'Prismic'
    }
  }

});

require(['app'], function(App) {
  App.run();
});