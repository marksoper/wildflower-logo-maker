import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('jurisdiction')
    // return {
    //   jurisdictions: this.store.all('jurisdiction'),
    //   selectedJurisdiction: null
    // }
  }
});
