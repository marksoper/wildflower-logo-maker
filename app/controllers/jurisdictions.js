
import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  selectedJurisdiction: function() {
    return this.model.jurisdictions.findBy('id', this.get('jurisdiction'))
  }.property('jurisdiction'),
  actions: {
    setJurisdiction: function(jurisdiction) {
      this.set('jurisdiction', jurisdiction.id);
    }
  }
});
