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
      selectStudentAge: function(j) {
          this.set('selectedStudentAge', j);
          this.sendAction('action', j)
      }
  },
  studentAgeRanges: [
    {
      id: "0-3",
      value: "0-3"
    },
    {
      id: "3-6",
      value: "3-6"
    }
  ]
});
