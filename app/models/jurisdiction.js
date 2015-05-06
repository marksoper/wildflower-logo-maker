import DS from 'ember-data';

var Jurisdiction = DS.Model.extend({
  name: DS.attr('string')
});

var createFixedAgeGroupQualifications = function(stateName) {
  if (stateName !== "Massachusetts") {
    return null;
  }
  return {
    0: {
      ageGroup: "Infant/Toddler Group",
      ageRange: "0 - 33 months",
      maxGroupSize: 9,
      educatorsRequiredPerNumberOfChildren: [ [[1,3],1], [[4,9], 2] ],
      educatorChildRatio: "1:3; one additional educator for 4-9 children",
      regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
      educatorQualifications: "At least one Infant/Toddler Teacher, per 606 CMR 7.09(18)(c)2",
      notes: "No more than 3 infants (up to 15 months old)"
    },
    1: {
      ageGroup: "Toddler/Preschool Group",
      ageRange: "15 months - school age",
      maxGroupSize: 9,
      educatorsRequiredPerNumberOfChildren: [ [[1,5],1], [[6,9], 2] ],
      educatorChildRatio: "1:5; one additional educator for 6-9 children",
      regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
      educatorQualifications: "At least one Infant/Toddler and Preschool Teacher, per 606 CMR 7.09(18)(c)2"
    },
    2: {
      ageGroup: "Preschool/School Age Group",
      ageRange: "33 months - school age",
      maxGroupSize: 20,
      educatorsRequiredPerNumberOfChildren: [ [[1,10],1], [[11,20], 2] ],
      educatorChildRatio: "1:10",
      regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
      educatorQualifications: "At least one Preschool Teacher, per 606 CMR 7.09(18)(c)2"
    },
    3: {
      ageGroup: "Kindergarten/School Age Group",
      ageRange: "Kindergarten (attending 1st grade following year) - school age",
      maxGroupSize: 26,
      educatorsRequiredPerNumberOfChildren: [ [[1,13],1], [[14,26], 2] ],
      educatorChildRatio: "1:13",
      regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
      educatorQualifications: "Group Leader, per 606 CMR 7.09(19)(a)2"
    }
  }
};

var createJurisdictionFixtures = function() {
  var usaStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  var jurisdictions = [];
  usaStates.forEach(function(stateName) {
    var jd = {
      id: stateName.toLowerCase().replace(/\s/g, "-"),
      name: stateName
    };
    if (stateName === "Massachusetts") {
      jd.ageRanges = createFixedAgeGroupQualifications(stateName);
    }
    jurisdictions.push(jd);
  });
  return jurisdictions;
};

Jurisdiction.reopenClass({
  FIXTURES: createJurisdictionFixtures()
});

export default Jurisdiction;



