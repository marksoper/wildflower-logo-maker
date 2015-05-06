import Ember from 'ember';
import MA from '../models/MA';

var calculateRequiredTeachers = function(ageRange, studentCount) {
  if (!ageRange || !studentCount) {
    return null;
  }
  var tooManyStudentsError;
  if (studentCount.value > ageRange.maxGroupSize) {
    tooManyStudentsError = true;
  }
  return {
    ageRange: ageRange,
    studentCount: studentCount,
    tooManyStudentsError: tooManyStudentsError
  };
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
  studentAgeRanges: MA.ageRanges,
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
