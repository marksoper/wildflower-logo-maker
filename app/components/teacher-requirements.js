import Ember from 'ember';

export default Ember.Component.extend({
  requiredTeachers: null,
  actions: {
    setStudentAge: function(studentAge) {
      this.set('studentAge', studentAge.id);
      this.set('requiredTeachers', 5);
    }
  }
});
