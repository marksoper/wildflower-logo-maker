
var fixedAgeGroups = [
  {
    id: 0,
    groupName: "Infants",
    ageRangeDisplay: "Up to 15 months old"
  }
];

var ageRanges = [
  {
    id: 0,
    ageGroup: "Infant/Toddler Group",
    ageRange: "0 - 33 months",
    maxGroupSize: 9,
    educatorsRequiredPerNumberOfChildren: [ [[1,3],1], [[4,9], 2] ],
    educatorChildRatio: "1:3; one additional educator for 4-9 children",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Infant/Toddler Teacher, per 606 CMR 7.09(18)(c)2",
    notes: "No more than 3 infants (up to 15 months old)"
  },
  {
    id: 1,
    ageGroup: "Toddler/Preschool Group",
    ageRange: "15 months - school age",
    maxGroupSize: 9,
    educatorsRequiredPerNumberOfChildren: [ [[1,5],1], [[6,9], 2] ],
    educatorChildRatio: "1:5; one additional educator for 6-9 children",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Infant/Toddler and Preschool Teacher, per 606 CMR 7.09(18)(c)2"
  },
  {
    id: 2,
    ageGroup: "Preschool/School Age Group",
    ageRange: "33 months - school age",
    maxGroupSize: 20,
    educatorsRequiredPerNumberOfChildren: [ [[1,10],1], [[11,20], 2] ],
    educatorChildRatio: "1:10",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Preschool Teacher, per 606 CMR 7.09(18)(c)2"
  },
  {
    id: 3,
    ageGroup: "Kindergarten/School Age Group",
    ageRange: "Kindergarten (attending 1st grade following year) - school age",
    maxGroupSize: 26,
    educatorsRequiredPerNumberOfChildren: [ [[1,13],1], [[14,26], 2] ],
    educatorChildRatio: "1:13",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "Group Leader, per 606 CMR 7.09(19)(a)2"
  }
];

var licensedCapacity = [
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (a)",
    licensedCapacityDisplay: "No more than ten infant-school-age",
    capacity: [1,10],
    ageRanges: [0,1,2,3],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Family Child Care Provider or Teacher or Site Coordinator" 
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (b)",
    licensedCapacityDisplay: "11 through 13 infant-preschool",
    capacity: [11,13],
    ageRanges: [0,1],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Lead Teacher" 
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (d)",
    licensedCapacityDisplay: "14 through 26 infant-preschool",
    capacity: [14,26],
    ageRanges: [0,1],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Director I"
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (f)",
    licensedCapacityDisplay: "40 through 79 infant-preschool",
    capacity: [40,79],
    ageRanges: [0,1],
    requiredNonTeachingAdminTime: "100% FTE",
    administratorQualifications: "Director I"
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (g)",
    licensedCapacityDisplay: "40 through 79 infant-preschool",
    capacity: [80,Infinity],
    ageRanges: [0,1],
    requiredNonTeachingAdminTime: "100% FTE",
    administratorQualifications: "Director II"
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (h)",
    licensedCapacityDisplay: "11 through 52 school age children",
    capacity: [11,52],
    ageRanges: [2,3],
    requiredNonTeachingAdminTime: "20% FTE",
    administratorQualifications: "School Age Administrator"
  },
  {
    regulationNumber: "606 CMR 7.04(17)(m)9 (h)",
    licensedCapacityDisplay: "11 through 52 school age children",
    capacity: [53,Infinity],
    ageRanges: [2,3],
    requiredNonTeachingAdminTime: "100% FTE",
    administratorQualifications: "School Age Administrator"
  }
];

export default {
  ageRanges: ageRanges,
  licensedCapacity: licensedCapacity
};