import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      jurisdictions: this.store.all('jurisdiction'),
      selectedJurisdiction: null
    }
  }
});
