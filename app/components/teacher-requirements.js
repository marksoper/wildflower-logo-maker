import Ember from 'ember';
import MA from '../models/MA';

var calculateSquareFootage = function(studentCount) {
  return 50 * studentCount;
};

var calculateRequiredTeachers = function(ageRange, studentCount, licensedCapacity) {
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
    studentCount: studentCount,
    tooManyStudentsError: tooManyStudentsError,
    numberOfTeachersRequired: numberOfTeachersRequired,
    squareFootage: calculateSquareFootage(studentCount),
    administrator: calculateAdministrator(ageRange, licensedCapacity, studentCount)
  };
};

var calculateAdministrator= function(ageRange, licensedCapacity, studentCount) {
  var administratorData;
  var lc;
  for (var i=0; i<licensedCapacity.length; i++) {
    lc = licensedCapacity[i];
    if (lc.ageRanges.indexOf(ageRange.id) >= 0) {
      if (studentCount >= lc.capacity[0] && studentCount <= lc.capacity[1]) {
        administratorData = lc;
      }
    }
    if (administratorData) {
      break;
    }
  }
  return administratorData;
};

export default Ember.Component.extend({
  //
  // TODO: make actions more DRY
  // TODO: handling of notes is pretty hacky
  //
  requiredTeachers: null,
  actions: {
    setStudentAge: function(studentAge) {
      this.set('studentAge', studentAge);
      if (this.studentAge.notes) {
        this.set('notes', true);
      }
      if (this.studentAge && this.studentCount) {
        this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value, MA.licensedCapacity));
        if (this.requiredTeachers.administrator && this.requiredTeachers.administrator.notes) {
          this.set('notes', true);
        }
      }
    },
    setStudentCount: function(studentCount) {
      this.set('studentCount', studentCount);
      if (this.studentAge && this.studentCount) {
        this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value, MA.licensedCapacity));
      }
      if (this.requiredTeachers.administrator && this.requiredTeachers.administrator.notes) {
        this.set('notes', true);
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
