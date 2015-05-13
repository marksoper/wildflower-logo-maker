import DS from 'ember-data';

var Jurisdiction = DS.Model.extend({
  name: DS.attr('string')
});

var createJurisdictionFixtures = function() {
  var usaStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  var jurisdictions = [];
  usaStates.forEach(function(stateName) {
    var jd = {
      id: stateName.toLowerCase().replace(/\s/g, "-"),
      name: stateName,
      bogus: "foo"
    };
    jurisdictions.push(jd);
  });
  return jurisdictions;
};

Jurisdiction.reopenClass({
  FIXTURES: createJurisdictionFixtures()
});

export default Jurisdiction;



