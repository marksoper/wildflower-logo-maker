import Ember from 'ember';
import MA from '../models/MA';

var calculateSquareFootage = function(studentCount) {
  return 50 * studentCount.value;
};

var calculateRequiredTeachers = function(ageRange, studentCount) {
  if (!ageRange || !studentCount) {
    return null;
  }
  var tooManyStudentsError;
  var numberOfTeachersRequired;
  if (studentCount.value > ageRange.maxGroupSize) {
    tooManyStudentsError = true;
  } else {
    ageRange.educatorsRequiredPerNumberOfChildren.forEach(function(range) {
      if (studentCount.value >= range[0][0] && studentCount.value <= range[0][1]) {
        numberOfTeachersRequired = range[1];
      }
    });
  }
  return {
    ageRange: ageRange,
    studentCount: studentCount,
    tooManyStudentsError: tooManyStudentsError,
    numberOfTeachersRequired: numberOfTeachersRequired,
    squareFootage: calculateSquareFootage(studentCount)
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
