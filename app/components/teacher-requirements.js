import Ember from 'ember';

var calculateRequiredTeachers = function(studentAge, studentCount) {
  if (studentAge && studentCount) {
    return studentAge.id * 2 + studentCount.id;
  }
  return null;
};

export default Ember.Component.extend({
  requiredTeachers: null,
  actions: {
    setStudentAge: function(studentAge) {
      this.set('studentAge', studentAge);
      this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount));
    },
    setStudentCount: function(studentCount) {
      this.set('studentCount', studentCount);
      this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount));
    }
  },
  studentAgeRanges: [
    {
      id: "1",
      value: "0-3"
    },
    {
      id: "2",
      value: "3-6"
    },
    {
      id: "3",
      value: "6-9"
    },
    {
      id: "4",
      value: "9-12"
    }
  ],
  studentCounts: (function() {
    var counts = [];
    var i = 1;
    while (i<=30) {
      counts.push({
        id: i,
        value: i
      });
      i+=1;
    }
    return counts;
  }())
});
