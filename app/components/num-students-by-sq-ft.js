import Ember from 'ember';

var calculateNumStudentsFromSqFt = function(sqft) {
  return Math.floor(sqft / 50);
};

export default Ember.Component.extend({
  requiredTeachers: null,
  actions: {
    setSqFt: function(sqft) {
      this.set('sqft', sqft);
      this.set('studentCount', calculateNumStudentsFromSqFt(this.sqft.value));
    }
  },
  sqfts: (function() {
    var sqfts = [];
    var i = 1;
    while (i<=30) {
      sqfts.push({
        id: i*50,
        value: i*50
      });
      i+=1;
    }
    return sqfts;
  }())
});