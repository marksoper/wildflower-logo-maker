import Ember from 'ember';
import MA from '../models/MA';

var calculateSquareFootage = function(studentCount) {
  return 50 * studentCount;
};

var calculateRequiredTeachers = function(ageRange, studentCount) {
  if (!ageRange || !studentCount) {
    return null;
  }
  var tooManyStudentsError;
  var numberOfTeachersRequired;
  if (studentCount > ageRange.maxGroupSize) {
    tooManyStudentsError = true;
  } else {
    ageRange.educatorsRequiredPerNumberOfChildren.forEach(function(range) {
      if (studentCount >= range[0][0] && studentCount <= range[0][1]) {
        numberOfTeachersRequired = range[1];
      }
    });
  }
  return {
    ageRange: ageRange,
    studentCount: studentCount,
    tooManyStudentsError: tooManyStudentsError,
    numberOfTeachersRequired: numberOfTeachersRequired,
    squareFootage: calculateSquareFootage(studentCount),
    educatorQualifications: MA.educatorQualifications
  };
};

export default Ember.Component.extend({
  requiredTeachers: null,
  actions: {
    setStudentAge: function(studentAge) {
      this.set('studentAge', studentAge);
      if (this.studentAge && this.studentCount) {
        this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value));
      }
    },
    setStudentCount: function(studentCount) {
      this.set('studentCount', studentCount);
      if (this.studentAge && this.studentCount) {
        this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value));
      }
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
