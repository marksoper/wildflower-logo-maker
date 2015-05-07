import Ember from 'ember';

export default Ember.Component.extend({
  id: 'filter',
  active: false,
  classNames: ['dropdown'],
  classNameBindings: ['active'],
  click: function() {
    this.set('active', !this.get('active'));
    return false;
  },
  actions: {
      selectSqFt: function(j) {
          this.set('selectedSqFt', j);
          this.sendAction('action', j)
      }
  }
});
