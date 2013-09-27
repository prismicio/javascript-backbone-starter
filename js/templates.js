define([
  'text!../templates/documents.html',
  'text!../templates/detail.html',
  'text!../templates/search.html',
  'text!../templates/header.html',
  'text!../templates/footer.html',
  'text!../templates/notFound.html'
], function(DocumentsList, DocumentDetail, SearchResults, Header, Footer, NotFound) {
  
  return {
    DocumentsList:    _.template(DocumentsList),
    DocumentDetail:   _.template(DocumentDetail),
    SearchResults:    _.template(SearchResults),
    Header:           _.template(Header),
    Footer:           _.template(Footer),
    NotFound:         _.template(NotFound)
  };

});