import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return {
      jurisdiction: this.store.find('jurisdiction', params.jurisdiction_id)
    }
  }
});
