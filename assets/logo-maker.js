/* jshint ignore:start */

/* jshint ignore:end */

define('logo-maker/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].FixtureAdapter;

});
define('logo-maker/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'logo-maker/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default'],
    LOG_TRANSITIONS: true
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('logo-maker/components/fabric-canvas', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    /*global fabric,$*/
    function placeFlower(flower, index) {

        fabric.Image.fromURL(flower.get('location'), (function (img) {

            img.set({
                left: this.canvasFlowers.getLeft() + 50 * index,
                top: this.canvas.height / 2 - 35,
                hasBorders: false
            });

            this.canvasFlowers.addWithUpdate(img).centerH();
        }).bind(this));
    }

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'canvas',
        didInsertElement: function didInsertElement() {
            var h = $('#content').height(),
                w = $('#content').width();

            this.canvas = new fabric.StaticCanvas(this.get('element'), {
                width: w,
                height: h
            });

            this.canvasFlowers = new fabric.Group([]);
            this.canvasTitle = new fabric.Group([]);
            this.canvasSubtitle = new fabric.Group([new fabric.Text('Montessori School', {
                left: 0,
                hasBorders: false
            })], {
                visible: false
            });

            this.canvas.add(this.canvasFlowers).add(this.canvasTitle).add(this.canvasSubtitle);

            this.canvasFlowers.centerH();
            this.canvasTitle.centerH();
            this.canvasSubtitle.centerH();
        },
        updateName: Ember['default'].observer('name', function (fc, prop) {
            var title = new fabric.Text(fc.get(prop), {
                left: 0,
                top: this.canvas.height / 2 + 35,
                hasBorders: false
            });

            this.canvasTitle.remove.apply(this.canvasTitle, this.canvasTitle.getObjects());
            this.canvasTitle.addWithUpdate(title).centerH();

            this.canvasSubtitle.setTop(this.canvas.height / 2 + (title.height + 35));
            if (!this.canvasSubtitle.getVisible()) {
                this.canvasSubtitle.setVisible(true);
            }
        }),
        updateFlowers: Ember['default'].observer('flowers', function (a) {
            var selectedFlowers = a.get('flowers');
            this.canvasFlowers.remove.apply(this.canvasFlowers, this.canvasFlowers.getObjects());
            selectedFlowers.forEach(placeFlower, this);

            if (this.canvasFlowers.isEmpty()) {
                this.canvas.renderAll();
            }
        }),
        updateFont: Ember['default'].observer('font', function () {}),
        updatePalette: Ember['default'].observer('palette', function () {}),
        updateArrangement: Ember['default'].observer('arrangement', function () {})
    });

    //this.canvas update font

    //this.canvas update palette

    //this.canvas update arrangement

});
define('logo-maker/components/font-dropdown', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        id: 'filter',
        active: false,
        classNames: ['dropdown'],
        classNameBindings: ['active'],
        click: function click() {
            this.set('active', !this.get('active'));
            return false;
        },
        actions: {
            selectFont: function selectFont(font) {
                this.sendAction('action', font);
            }
        }
    });

});
define('logo-maker/components/jurisdiction-dropdown', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    id: 'filter',
    active: false,
    classNames: ['dropdown'],
    classNameBindings: ['active'],
    click: function click() {
      this.set('active', !this.get('active'));
      return false;
    },
    actions: {
      setJurisdiction: function setJurisdiction(j) {
        this.set('selectedJurisdiction', j);
      }
    }
  });

});
define('logo-maker/components/letter-split', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    function linearMap(low1, hi1, point1, low2, hi2) {
        var point2;

        point2 = (low2 * point1 - low1 * low2 + hi1 * hi2 - hi2 * point1) / (hi1 - low1);
        return point2;
    }

    exports['default'] = Ember['default'].Component.extend({
        classNamesBindings: ['class'],
        attributeBindings: ['style'],
        style: (function () {
            if (this.get('text').match(/montessori/i) || this.get('size') === 'small') {
                return '';
            }

            var letterCount = this.get('text').length,
                sizeRange = [48, 110],
                countRange = [5, 13],
                size;

            if (letterCount <= 5) {
                size = Math.max.apply(null, sizeRange);
            } else if (letterCount >= 13) {
                size = Math.min.apply(null, sizeRange);
            } else {
                size = linearMap(countRange[0], countRange[1], letterCount, sizeRange[0], sizeRange[1]);
            }

            return 'font-size: ' + size + 'px;';
        }).property('text'),
        letters: (function () {
            var _this = this;

            var letters = this.get('text').split(''),
                colors = this.get('palette').colors,
                colorsCount = colors.length;

            return letters.map(function (letter, index) {
                var color;

                if (colorsCount === 2) {
                    if (_this.get('text').match(/montessori/i)) {
                        color = 'color: ' + colors[0] + ';';
                    } else {
                        color = 'color: ' + colors[1] + ';';
                    }
                } else {
                    color = 'color: ' + colors[index % colorsCount] + ';';
                }

                return {
                    letter: letter,
                    colorStyle: color
                };
            });
        }).property('palette', 'text')
    });

});
define('logo-maker/components/logo-view', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['logo'],
        classNameBindings: ['arrangement', 'size'],
        attributeBindings: ['main:id'],
        main: (function () {
            return this.get('view') === 'main' ? 'logo' : '';
        }).property('view')
    });

});
define('logo-maker/components/num-students-by-sq-ft', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var calculateNumStudentsFromSqFt = function calculateNumStudentsFromSqFt(sqft) {
    return Math.floor(sqft / 50);
  };

  exports['default'] = Ember['default'].Component.extend({
    requiredTeachers: null,
    actions: {
      setSqFt: function setSqFt(sqft) {
        this.set('sqft', sqft);
        this.set('studentCount', calculateNumStudentsFromSqFt(this.sqft.value));
      }
    },
    sqfts: (function () {
      var sqfts = [];
      var i = 1;
      while (i <= 30) {
        sqfts.push({
          id: i * 50,
          value: i * 50
        });
        i += 1;
      }
      return sqfts;
    })()
  });

});
define('logo-maker/components/palette-box', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    /*global $*/
    exports['default'] = Ember['default'].Component.extend({
        classNames: 'grid-item',
        isBigPalette: (function () {
            return this.get('palette.colors').length > 2;
        }).property('palette.colors'),
        didInsertElement: function didInsertElement() {
            var spans = $(this.get('element')).find('span');

            this.get('palette.colors').forEach(function (color, i) {
                if ($(spans[i]).hasClass('two-color')) {
                    if (i === 0) {
                        $(spans[i]).css('border-bottom-color', color);
                    } else {
                        $(spans[i]).css('border-top-color', color);
                    }
                } else {
                    $(spans[i]).css('background-color', color);
                }
            });
        },
        actions: {
            setPalette: function setPalette(palette) {
                this.sendAction('setPalette', palette);
            }
        }
    });

});
define('logo-maker/components/sqft-dropdown', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    id: 'filter',
    active: false,
    classNames: ['dropdown'],
    classNameBindings: ['active'],
    click: function click() {
      this.set('active', !this.get('active'));
      return false;
    },
    actions: {
      selectSqFt: function selectSqFt(j) {
        this.set('selectedSqFt', j);
        this.sendAction('action', j);
      }
    }
  });

});
define('logo-maker/components/student-age-dropdown', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    id: 'filter',
    active: false,
    classNames: ['dropdown'],
    classNameBindings: ['active'],
    click: function click() {
      this.set('active', !this.get('active'));
      return false;
    },
    actions: {
      selectStudentAge: function selectStudentAge(j) {
        this.set('selectedStudentAge', j);
        this.sendAction('action', j);
      }
    }
  });

});
define('logo-maker/components/student-count-dropdown', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    id: 'filter',
    active: false,
    classNames: ['dropdown'],
    classNameBindings: ['active'],
    click: function click() {
      this.set('active', !this.get('active'));
      return false;
    },
    actions: {
      selectStudentCount: function selectStudentCount(j) {
        this.set('selectedStudentCount', j);
        this.sendAction('action', j);
      }
    }
  });

});
define('logo-maker/components/teacher-requirements', ['exports', 'ember', 'logo-maker/models/MA'], function (exports, Ember, MA) {

  'use strict';

  var calculateSquareFootage = function calculateSquareFootage(studentCount) {
    return 50 * studentCount;
  };

  var calculateRequiredTeachers = function calculateRequiredTeachers(ageRange, studentCount, licensedCapacity) {
    if (!ageRange || !studentCount) {
      return null;
    }
    var tooManyStudentsError;
    var numberOfTeachersRequired;
    if (studentCount > ageRange.maxGroupSize) {
      tooManyStudentsError = true;
    } else {
      ageRange.educatorsRequiredPerNumberOfChildren.forEach(function (range) {
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

  var calculateAdministrator = function calculateAdministrator(ageRange, licensedCapacity, studentCount) {
    var administratorData;
    var lc;
    for (var i = 0; i < licensedCapacity.length; i++) {
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

  exports['default'] = Ember['default'].Component.extend({
    //
    // TODO: make actions more DRY
    // TODO: handling of notes is pretty hacky
    //
    requiredTeachers: null,
    actions: {
      setStudentAge: function setStudentAge(studentAge) {
        this.set('studentAge', studentAge);
        if (this.studentAge.notes) {
          this.set('notes', true);
        }
        if (this.studentAge && this.studentCount) {
          this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value, MA['default'].licensedCapacity));
          if (this.requiredTeachers.administrator && this.requiredTeachers.administrator.notes) {
            this.set('notes', true);
          }
        }
      },
      setStudentCount: function setStudentCount(studentCount) {
        this.set('studentCount', studentCount);
        if (this.studentAge && this.studentCount) {
          this.set('requiredTeachers', calculateRequiredTeachers(this.studentAge, this.studentCount.value, MA['default'].licensedCapacity));
        }
        if (this.requiredTeachers.administrator && this.requiredTeachers.administrator.notes) {
          this.set('notes', true);
        }
      }
    },
    studentAgeRanges: MA['default'].ageRanges,
    studentCounts: (function () {
      var counts = [];
      var i = 1;
      while (i <= 30) {
        counts.push({
          id: i,
          value: i
        });
        i += 1;
      }
      return counts;
    })()
  });

});
define('logo-maker/controllers/jurisdiction', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('logo-maker/controllers/logo', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    /*global html2canvas,$*/
    exports['default'] = Ember['default'].ObjectController.extend({
        needs: ['application'],

        inventory: (function () {
            var inventory = this.get('controllers.application').get('model'),
                palette = inventory.palettes.findBy('id', this.get('palette').id),
                arrangement = inventory.arrangements.findBy('id', this.get('arrangement').id);

            if (palette) {
                palette.set('selected', true);
            }
            if (arrangement) {
                arrangement.set('selected', true);
            }

            return inventory;
        }).property('controllers.application'),

        selectedFont: (function () {
            return this.get('inventory').fonts.findBy('id', this.get('font'));
        }).property('inventory', 'font'),

        flowerObjects: (function () {
            var allFlowers = this.get('inventory.flowers'),
                flowerIds = this.get('flowerIds');

            allFlowers.forEach(function (flower) {
                flower.set('selected', false);
            });

            return flowerIds.map(function (id) {
                var f = allFlowers.findBy('id', id);
                f.set('selected', true);
                return f;
            });
        }).property('flowerIds.[]', 'inventory.flowers.[]'),

        actions: {
            saveFlower: function saveFlower() {
                var _this = this;

                html2canvas($('#logo').get(0), {
                    onrendered: function onrendered(canvas) {
                        _this.set('dataurl', canvas.toDataURL());
                        setTimeout(function () {
                            return $('#download').get(0).click();
                        }, 0);
                    }
                });
            },

            toggleFlower: function toggleFlower(flower) {
                var ids = this.get('flowerIds');
                if (ids.length < 3 || flower.get('selected')) {
                    var i = ids.indexOf(flower.get('id'));
                    if (i === -1) {
                        ids.pushObject(flower.get('id'));
                    } else {
                        ids.replace(i, 1);
                    }
                }
            },

            setPalette: function setPalette(palette) {
                this.set('palette', palette);

                this.get('inventory.palettes').forEach(function (palette) {
                    palette.set('selected', false);
                });

                palette.set('selected', true);
            },

            setArrangement: function setArrangement(a) {
                this.set('arrangement', a);

                this.get('inventory.arrangements').forEach(function (a) {
                    a.set('selected', false);
                });

                a.set('selected', true);
            },

            setFont: function setFont(font) {
                this.set('font', font.id);
            }
        }
    });

});
define('logo-maker/initializers/app-version', ['exports', 'logo-maker/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('logo-maker/initializers/export-application-global', ['exports', 'ember', 'logo-maker/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('logo-maker/models/MA', ['exports'], function (exports) {

  'use strict';


  var ageRanges = [{
    id: 0,
    ageGroup: "Infant/Toddler Group",
    ageRange: "0 - 33 months",
    maxGroupSize: 9,
    educatorsRequiredPerNumberOfChildren: [[[1, 3], 1], [[4, 9], 2]],
    educatorChildRatio: "1:3; one additional educator for 4-9 children",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Infant/Toddler Teacher, per 606 CMR 7.09(18)(c)2",
    notes: "No more than 3 infants (up to 15 months old)"
  }, {
    id: 1,
    ageGroup: "Toddler/Preschool Group",
    ageRange: "15 months - school age",
    maxGroupSize: 9,
    educatorsRequiredPerNumberOfChildren: [[[1, 5], 1], [[6, 9], 2]],
    educatorChildRatio: "1:5; one additional educator for 6-9 children",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Infant/Toddler and Preschool Teacher, per 606 CMR 7.09(18)(c)2"
  }, {
    id: 2,
    ageGroup: "Preschool/School Age Group",
    ageRange: "33 months - school age",
    maxGroupSize: 20,
    educatorsRequiredPerNumberOfChildren: [[[1, 10], 1], [[11, 20], 2]],
    educatorChildRatio: "1:10",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "At least one Preschool Teacher, per 606 CMR 7.09(18)(c)2"
  }, {
    id: 3,
    ageGroup: "Kindergarten/School Age Group",
    ageRange: "Kindergarten (attending 1st grade following year) - school age",
    maxGroupSize: 26,
    educatorsRequiredPerNumberOfChildren: [[[1, 13], 1], [[14, 26], 2]],
    educatorChildRatio: "1:13",
    regulationNumber: "606 CMR 7.10(9)(c)1 & 606 CMR 7.10(9)(c)2",
    educatorQualifications: "Group Leader, per 606 CMR 7.09(19)(a)2"
  }];

  var licensedCapacity = [{
    id: 0,
    regulationNumber: "606 CMR 7.04(17)(m)9 (a)",
    licensedCapacityDisplay: "No more than ten infant-school-age",
    capacity: [1, 10],
    ageRanges: [0, 1, 2, 3],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Family Child Care Provider or Teacher or Site Coordinator"
  }, {
    id: 1,
    regulationNumber: "606 CMR 7.04(17)(m)9 (b)",
    licensedCapacityDisplay: "11 through 13 infant-preschool",
    capacity: [11, 13],
    ageRanges: [0, 1, 2, 3],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Lead Teacher"
  }, {
    id: 2,
    regulationNumber: "606 CMR 7.04(17)(m)9 (d)",
    licensedCapacityDisplay: "14 through 26 infant-preschool",
    capacity: [14, 26],
    ageRanges: [0, 1, 2, 3],
    requiredNonTeachingAdminTime: "0",
    administratorQualifications: "Director I",
    notes: "Director I is required for 4 or more hours of operation per day. Less than 4 hours of operation per day requires Lead Teacher."
  }, {
    id: 3,
    regulationNumber: "606 CMR 7.04(17)(m)9 (e)",
    licensedCapacityDisplay: "27 through 39 infant-preschool",
    capacity: [27, 39],
    ageRanges: [0, 1, 2, 3],
    requiredNonTeachingAdminTime: "50% FTE",
    administratorQualifications: "Director I"
  }
  //
  // TODO: where is kindgergarten in this list ?
  //
  /*
  {
    id: 4,
    regulationNumber: "606 CMR 7.04(17)(m)9 (h)",
    licensedCapacityDisplay: "11 through 52 school age children",
    capacity: [11,52],
    ageRanges: [2,3],
    requiredNonTeachingAdminTime: "20% FTE",
    administratorQualifications: "School Age Administrator"
  }
  */
  ];

  exports['default'] = {
    ageRanges: ageRanges,
    licensedCapacity: licensedCapacity
  };

});
define('logo-maker/models/flower', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        location: DS['default'].attr()
    });

});
define('logo-maker/models/font', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        title: DS['default'].attr(),
        filename: DS['default'].attr(),
        location: DS['default'].attr()
    });

});
define('logo-maker/models/jurisdiction', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var Jurisdiction = DS['default'].Model.extend({
    name: DS['default'].attr('string')
  });

  var createJurisdictionFixtures = function createJurisdictionFixtures() {
    var usaStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    var jurisdictions = [];
    usaStates.forEach(function (stateName) {
      var jd = {
        id: stateName.toLowerCase().replace(/\s/g, '-'),
        name: stateName,
        bogus: 'foo'
      };
      jurisdictions.push(jd);
    });
    return jurisdictions;
  };

  Jurisdiction.reopenClass({
    FIXTURES: createJurisdictionFixtures()
  });

  exports['default'] = Jurisdiction;

});
define('logo-maker/models/logo', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        name: DS['default'].attr(),
        font: DS['default'].attr(),
        flowerIds: DS['default'].attr(),
        palette: DS['default'].attr(),
        arrangement: DS['default'].attr()
    });

});
define('logo-maker/models/palette', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        color_1: DS['default'].attr()
    });

});
define('logo-maker/router', ['exports', 'ember', 'logo-maker/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('new', { path: '/' });
    this.route('view', { path: 'view/:logo_id' });
    this.route('logo', { path: '/:logo_id' });
    this.route('jurisdiction', { path: 'licensing' }, function () {
      this.route('view', { path: ':jurisdiction_id' });
    });
  });

  exports['default'] = Router;

});
define('logo-maker/routes/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var fonts = [{
        name: 'Georgia',
        className: 'georgia'
    }, {
        name: 'Helvetica',
        className: 'helvetica'
    }, {
        name: 'Times New Roman',
        className: 'times'
    }, {
        name: 'Avenir',
        className: 'avenir'
    }, {
        name: 'Kim1',
        className: 'kim1'
    }, {
        name: 'Kim2',
        className: 'kim2'
    }, {
        name: 'Sep',
        className: 'sep'
    }, {
        name: 'Wildchild',
        className: 'wildchild'
    }];
    exports['default'] = Ember['default'].Route.extend({
        model: function model() {
            return {
                flowers: (function () {
                    var f = [];
                    for (var i = 1; i < 21; i++) {
                        f.push(Ember['default'].Object.create({
                            location: '/assets/img/flower' + i + '.png',
                            id: i
                        }));
                    }
                    return f;
                })(),
                fonts: (function () {
                    var f = [];
                    for (var i = 0; i < fonts.length; i++) {
                        fonts[i].id = i + 1;
                        f.push(Ember['default'].Object.create(fonts[i]));
                    }
                    return f;
                })(),
                palettes: [Ember['default'].Object.create({
                    id: 1,
                    colors: ['#1ab6f5', '#1a86f5']
                }), Ember['default'].Object.create({
                    id: 2,
                    colors: ['#079d66', '#73c412']
                }), Ember['default'].Object.create({
                    id: 3,
                    colors: ['#e5b113', '#e57613']
                }), Ember['default'].Object.create({
                    id: 4,
                    colors: ['#4f03fc', '#893cfd']
                }), Ember['default'].Object.create({
                    id: 5,
                    colors: ['#bb6de1', '#9f37b5']
                }), Ember['default'].Object.create({
                    id: 6,
                    colors: ['#ff3c00', '#e5b113', '#e57613', '#cb0ab2', '#c0b405', '#7cc005']
                }), Ember['default'].Object.create({
                    id: 7,
                    colors: ['#079d66', '#73c412', '#e5b113', '#e57613', '#fc5c05', '#c0b405']
                }), Ember['default'].Object.create({
                    id: 8,
                    colors: ['#bb6de1', '#c91153', '#cb0ab2', '#6363f3', '#3093f8', '#044ed5']
                })],
                arrangements: [Ember['default'].Object.create({
                    id: 1,
                    className: 'top'
                }), Ember['default'].Object.create({
                    id: 2,
                    className: 'bottom'
                }), Ember['default'].Object.create({
                    id: 3,
                    className: 'left'
                }), Ember['default'].Object.create({
                    id: 4,
                    className: 'right'
                })]
            };
        }
    });

});
define('logo-maker/routes/jurisdiction/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return this.store.find('jurisdiction');
    }
  });

});
define('logo-maker/routes/jurisdiction/view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model(params) {
      return this.store.find('jurisdiction', params.jurisdiction_id);
    }
  });

});
define('logo-maker/routes/new', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        renderTemplate: function renderTemplate() {
            this.render('logo', { controller: 'logo' });
        },
        model: function model() {
            return Ember['default'].Object.create({
                flowerIds: [],
                name: '',
                arrangement: { id: null, className: null },
                font: null,
                palette: { id: null, colors: [] }
            });
        },
        setupController: function setupController(controller, model) {
            this.controllerFor('logo').set('model', model);
        }
    });

});
define('logo-maker/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/font-dropdown', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown-item");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var morph0 = dom.createMorphAt(element1,0,0);
          element(env, element0, context, "action", ["selectFont", get(env, context, "f")], {});
          element(env, element1, context, "bind-attr", [], {"class": ":dropdown-option f.className"});
          content(env, morph0, context, "f.name");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("span");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","dropdown-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element2,0,0);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        element(env, element2, context, "bind-attr", [], {"class": ":dropdown-label selectedFont.className"});
        content(env, morph0, context, "selectedFont.name");
        block(env, morph1, context, "each", [get(env, context, "fonts")], {"keyword": "f"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/jurisdiction-dropdown', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            content(env, morph0, context, "j.name");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown-item");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          element(env, element0, context, "action", ["setJurisdiction", get(env, context, "j")], {});
          block(env, morph0, context, "link-to", ["jurisdiction.view", get(env, context, "j")], {"class": "dropdown-option"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","dropdown-label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","dropdown-list jurisdiction-dropdown");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
        content(env, morph0, context, "selectedJurisdiction.name");
        block(env, morph1, context, "each", [get(env, context, "jurisdictions")], {"keyword": "j"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/letter-split', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("span");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0]);
          var morph0 = dom.createMorphAt(element0,0,0);
          element(env, element0, context, "bind-attr", [], {"style": get(env, context, "l.colorStyle")});
          content(env, morph0, context, "l.letter");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "each", [get(env, context, "letters")], {"keyword": "l"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/logo-view', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","logo-image");
          dom.setAttribute(el2,"alt","");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 0]);
          element(env, element0, context, "bind-attr", [], {"src": get(env, context, "flower.location")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","logo-images");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [2]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        var morph1 = dom.createMorphAt(element1,1,1);
        var morph2 = dom.createMorphAt(element2,1,1);
        block(env, morph0, context, "each", [get(env, context, "flowerObjects")], {"keyword": "flower"}, child0, null);
        element(env, element1, context, "bind-attr", [], {"class": ":logo-textbox selectedFont.className"});
        inline(env, morph1, context, "letter-split", [], {"text": get(env, context, "name"), "palette": get(env, context, "palette"), "class": "logo-title", "size": get(env, context, "size")});
        element(env, element2, context, "bind-attr", [], {"class": ":logo-hide name::hide"});
        inline(env, morph2, context, "letter-split", [], {"text": "Montessori School", "palette": get(env, context, "palette"), "class": "logo-subtitle", "size": get(env, context, "size")});
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/num-students-by-sq-ft', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","licensing-step-output");
          var el2 = dom.createTextNode("\n\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","inputs-display");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","student-count-display inputs-display-input");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" square ft\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","outputs-display");
          var el3 = dom.createTextNode("\n\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","display-entry");
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","display-property");
          var el5 = dom.createTextNode("\n                  Number of students:\n                ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","display-value");
          var el5 = dom.createTextNode("\n                  ");
          dom.appendChild(el4, el5);
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode(" \n                ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1, 3]),1,1);
          content(env, morph0, context, "sqft.value");
          content(env, morph1, context, "studentCount");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","num-students-by-sq-ft licensing-step");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","licensing-step-header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("Number of students by square footage");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","licensing-step-body");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","licensing-step-input input-col");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","licensing-step-input-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","studentAgeDropdown");
        var el6 = dom.createTextNode("\n          What is the square footage of the classroom?\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","box box--flush dropdown licensing-step-control");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","output-col");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [1, 3]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1, 1, 3]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        inline(env, morph0, context, "sqft-dropdown", [], {"id": "sqFtDropdown", "selectedStudentAge": get(env, context, "selectedSqFt"), "action": "setSqFt", "sqfts": get(env, context, "sqfts")});
        block(env, morph1, context, "if", [get(env, context, "studentCount")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/palette-box', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          element(env, element0, context, "bind-attr", [], {"class": "isBigPalette:six-color:two-color"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","palette");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        element(env, element1, context, "bind-attr", [], {"class": ":btn :btn--highlight :btn--square palette.selected"});
        element(env, element1, context, "action", ["setPalette", get(env, context, "palette")], {});
        block(env, morph0, context, "each", [get(env, context, "palette.colors")], {"keyword": "color"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/sqft-dropdown', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown-item");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","dropdown-option");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          element(env, element0, context, "action", ["selectSqFt", get(env, context, "sqft")], {});
          content(env, morph0, context, "sqft.value");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","dropdown-label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","dropdown-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
        content(env, morph0, context, "selectedSqFt.value");
        block(env, morph1, context, "each", [get(env, context, "sqfts")], {"keyword": "sqft"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/student-age-dropdown', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown-item");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","dropdown-option");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          element(env, element0, context, "action", ["selectStudentAge", get(env, context, "ageRange")], {});
          content(env, morph0, context, "ageRange.ageRange");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","dropdown-label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","dropdown-list student-age-dropdown");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
        content(env, morph0, context, "selectedStudentAge.ageRange");
        block(env, morph1, context, "each", [get(env, context, "studentAgeRanges")], {"keyword": "ageRange"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/student-count-dropdown', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"class","dropdown-item");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","dropdown-option");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          element(env, element0, context, "action", ["selectStudentCount", get(env, context, "count")], {});
          content(env, morph0, context, "count.value");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","dropdown-label");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","dropdown-list student-count-dropdown");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
        content(env, morph0, context, "selectedStudentCount.value");
        block(env, morph1, context, "each", [get(env, context, "studentCounts")], {"keyword": "count"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/components/teacher-requirements', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","display-entry error-message");
            var el2 = dom.createTextNode("\n                Exceeds maximum group size of ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            content(env, morph0, context, "studentAge.maxGroupSize");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.11.1",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
              var el2 = dom.createTextNode("\n                  ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","display-property");
              var el3 = dom.createTextNode("\n                    Notes:\n                  ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n                  ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","display-value");
              var el3 = dom.createTextNode("\n                    ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("div");
              var el4 = dom.createTextNode("\n                      ");
              dom.appendChild(el3, el4);
              var el4 = dom.createComment("");
              dom.appendChild(el3, el4);
              var el4 = dom.createTextNode("\n                    ");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n                    ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("div");
              var el4 = dom.createTextNode("\n                      ");
              dom.appendChild(el3, el4);
              var el4 = dom.createComment("");
              dom.appendChild(el3, el4);
              var el4 = dom.createTextNode("\n                    ");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n                  ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n                ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element0 = dom.childAt(fragment, [1, 3]);
              var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
              var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
              content(env, morph0, context, "studentAge.notes");
              content(env, morph1, context, "requiredTeachers.administrator.notes");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.1",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-property");
            var el3 = dom.createTextNode("\n                  Regulations:\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-value");
            var el3 = dom.createTextNode("\n                  ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" \n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-property");
            var el3 = dom.createTextNode("\n                  Teachers required:\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-value");
            var el3 = dom.createTextNode("\n                  ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" \n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-property");
            var el3 = dom.createTextNode("\n                  Educator Qualifications:\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-value");
            var el3 = dom.createTextNode("\n                  ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" \n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n\n              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-property");
            var el3 = dom.createTextNode("\n                  Admin Qualifications:\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-value");
            var el3 = dom.createTextNode("\n                  ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" \n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","number-of-teachers-required display-entry");
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-property");
            var el3 = dom.createTextNode("\n                  Min Square Ft:\n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","display-value");
            var el3 = dom.createTextNode("\n                  ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode(" square feet \n                ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3, 3]),1,1);
            var morph2 = dom.createMorphAt(dom.childAt(fragment, [5, 3]),1,1);
            var morph3 = dom.createMorphAt(dom.childAt(fragment, [7, 3]),1,1);
            var morph4 = dom.createMorphAt(fragment,9,9,contextualElement);
            var morph5 = dom.createMorphAt(dom.childAt(fragment, [11, 3]),1,1);
            content(env, morph0, context, "studentAge.regulationNumber");
            content(env, morph1, context, "requiredTeachers.numberOfTeachersRequired");
            content(env, morph2, context, "studentAge.educatorQualifications");
            content(env, morph3, context, "requiredTeachers.administrator.administratorQualifications");
            block(env, morph4, context, "if", [get(env, context, "notes")], {}, child0, null);
            content(env, morph5, context, "requiredTeachers.squareFootage");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","teachers-required-output licensing-step-output");
          var el2 = dom.createTextNode("\n\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","inputs-display");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","student-count-display inputs-display-input");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" students\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","age-range-display inputs-display-input");
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","outputs-display");
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("          ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element1, [3]);
          var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
          var morph2 = dom.createMorphAt(element3,1,1);
          var morph3 = dom.createMorphAt(element3,3,3);
          content(env, morph0, context, "requiredTeachers.studentCount");
          content(env, morph1, context, "studentAge.ageRange");
          block(env, morph2, context, "if", [get(env, context, "requiredTeachers.tooManyStudentsError")], {}, child0, null);
          block(env, morph3, context, "unless", [get(env, context, "requiredTeachers.tooManyStudentsError")], {}, child1, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","teacher-requirements licensing-step");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","licensing-step-header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        var el4 = dom.createTextNode("Teacher and Building Requirements by Student Age and Number of Students");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","licensing-step-body");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","licensing-step-input input-col");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","licensing-step-input-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","studentAgeDropdown");
        var el6 = dom.createTextNode("\n          What age are your students?\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","box box--flush dropdown licensing-step-control");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","licensing-step-input-container");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5,"for","studentCountDropdown");
        var el6 = dom.createTextNode("\n          How many students do you have?\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","box box--flush dropdown licensing-step-control");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","output-col");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [1, 3]);
        var element5 = dom.childAt(element4, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element5, [1, 3]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element5, [3, 3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        inline(env, morph0, context, "student-age-dropdown", [], {"id": "stuentAgeDropdown", "selectedStudentAge": get(env, context, "selectedStudentAge"), "action": "setStudentAge", "studentAgeRanges": get(env, context, "studentAgeRanges")});
        inline(env, morph1, context, "student-count-dropdown", [], {"id": "studentCountDropdown", "selectedStudentAge": get(env, context, "selectedStudentCount"), "action": "setStudentCount", "studentCounts": get(env, context, "studentCounts")});
        block(env, morph2, context, "if", [get(env, context, "requiredTeachers")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/jurisdiction', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","licensing");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/jurisdiction/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","index-header");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" Licensing\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","widget jurisdiction-selector");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","get-started");
        var el3 = dom.createTextNode("\n      Choose a state to get started\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","box box--flush dropdown");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [3, 3]),1,1);
        content(env, morph0, context, "model.name");
        inline(env, morph1, context, "jurisdiction-dropdown", [], {"jurisdictions": get(env, context, "model"), "selectedJurisdiction": get(env, context, "selectedJurisdiction"), "action": "setJurisdiction"});
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/jurisdiction/view', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Choose a different State");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Number of students by square footage\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Number of students by number of teachers and student age\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","header");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" Licensing\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","to-jurisdiction-index");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","scenario-selector");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","scenarios-label");
        var el3 = dom.createTextNode("\n    Scenarios\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","scenario-entry");
        var el3 = dom.createTextNode("\n\n      Teacher requirements and square footage by student age and number of students\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","scenario-entry");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","scenario-entry");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, block = hooks.block, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1]);
        var element1 = dom.childAt(fragment, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [7]),1,1);
        var morph4 = dom.createMorphAt(fragment,5,5,contextualElement);
        var morph5 = dom.createMorphAt(fragment,7,7,contextualElement);
        content(env, morph0, context, "model.name");
        block(env, morph1, context, "link-to", ["jurisdiction"], {}, child0, null);
        block(env, morph2, context, "link-to", ["jurisdiction.view", get(env, context, "model.id")], {}, child1, null);
        block(env, morph3, context, "link-to", ["jurisdiction.view", get(env, context, "model.id")], {}, child2, null);
        inline(env, morph4, context, "teacher-requirements", [], {"model": get(env, context, "model")});
        inline(env, morph5, context, "num-students-by-sq-ft", [], {"model": get(env, context, "model")});
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/jurisdictions', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","licensing");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('logo-maker/templates/logo', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","grid-item");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createElement("img");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1, 1]);
          var element2 = dom.childAt(element1, [0]);
          element(env, element1, context, "action", ["toggleFlower", get(env, context, "flower")], {});
          element(env, element1, context, "bind-attr", [], {"class": ":btn :btn--image flower.selected"});
          element(env, element2, context, "bind-attr", [], {"src": get(env, context, "flower.location")});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "palette-box", [], {"palette": get(env, context, "palette"), "setPalette": "setPalette"});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.1",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","grid-item");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          var el3 = dom.createTextNode("\n                        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","logo--small");
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          element(env, element0, context, "bind-attr", [], {"class": ":btn :btn--highlight a.selected"});
          element(env, element0, context, "action", ["setArrangement", get(env, context, "a")], {});
          inline(env, morph0, context, "logo-view", [], {"size": "small", "arrangement": get(env, context, "a.className"), "flowerObjects": get(env, context, "flowerObjects"), "selectedFont": get(env, context, "selectedFont"), "name": get(env, context, "name"), "palette": get(env, context, "palette")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.1",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("section");
        dom.setAttribute(el1,"class","l-sidebar l-sidebar--highlight");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","box");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        dom.setAttribute(el2,"class","widget");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"class","widget-label");
        dom.setAttribute(el3,"for","");
        var el4 = dom.createTextNode("Enter your school name:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        dom.setAttribute(el2,"class","widget");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"class","widget-label");
        dom.setAttribute(el3,"for","");
        var el4 = dom.createTextNode("Choose a font:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","box box--flush");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        dom.setAttribute(el2,"class","widget");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","widget-label");
        dom.setAttribute(el3,"for","");
        var el4 = dom.createTextNode("Choose up to 3 flowers:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","box box--scroll");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","grid grid--three grid--lines");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","gap");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" .grid ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" .box ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" .widget ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        dom.setAttribute(el2,"class","widget");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","widget-label");
        var el4 = dom.createTextNode("Choose a color palette:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","box");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","grid grid--three");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","gap");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" .grid ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" .box ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" .widget ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("article");
        dom.setAttribute(el2,"class","widget");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","widget-label");
        var el4 = dom.createTextNode("Choose an arrangement:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","box");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","grid grid--two");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" .grid ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" .box ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" .widget ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" .l-sidebar ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("main");
        dom.setAttribute(el1,"class","l-content");
        dom.setAttribute(el1,"id","content");
        var el2 = dom.createTextNode("        \n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","l-lowerright");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","btn btn--download");
        var el4 = dom.createTextNode("Download ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","btn-icon");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"id","download");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" .l-content ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element3 = dom.childAt(fragment, [0]);
        var element4 = dom.childAt(fragment, [4]);
        var element5 = dom.childAt(element4, [3]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element5, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element3, [3]),3,3);
        var morph2 = dom.createMorphAt(dom.childAt(element3, [5, 3]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [7, 3, 1]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element3, [11, 3, 1]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element3, [15, 3, 1]),1,1);
        var morph6 = dom.createMorphAt(element4,1,1);
        inline(env, morph0, context, "link-to", ["Go To Licensing", "jurisdiction"], {});
        inline(env, morph1, context, "input", [], {"class": "widget-input", "type": "text", "value": get(env, context, "model.name")});
        inline(env, morph2, context, "font-dropdown", [], {"fonts": get(env, context, "inventory.fonts"), "selectedFont": get(env, context, "selectedFont"), "action": "setFont"});
        block(env, morph3, context, "each", [get(env, context, "inventory.flowers")], {"keyword": "flower"}, child0, null);
        block(env, morph4, context, "each", [get(env, context, "inventory.palettes")], {"keyword": "palette"}, child1, null);
        block(env, morph5, context, "each", [get(env, context, "inventory.arrangements")], {"keyword": "a"}, child2, null);
        inline(env, morph6, context, "logo-view", [], {"view": "main", "arrangement": get(env, context, "arrangement.className"), "flowerObjects": get(env, context, "flowerObjects"), "selectedFont": get(env, context, "selectedFont"), "name": get(env, context, "name"), "palette": get(env, context, "palette")});
        element(env, element6, context, "action", ["saveFlower"], {});
        element(env, element7, context, "bind-attr", [], {"href": get(env, context, "dataurl"), "download": get(env, context, "name")});
        return fragment;
      }
    };
  }()));

});
define('logo-maker/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('logo-maker/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/fabric-canvas.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/fabric-canvas.js should pass jshint', function() { 
    ok(true, 'components/fabric-canvas.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/font-dropdown.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/font-dropdown.js should pass jshint', function() { 
    ok(true, 'components/font-dropdown.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/jurisdiction-dropdown.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/jurisdiction-dropdown.js should pass jshint', function() { 
    ok(true, 'components/jurisdiction-dropdown.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/letter-split.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/letter-split.js should pass jshint', function() { 
    ok(true, 'components/letter-split.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/logo-view.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/logo-view.js should pass jshint', function() { 
    ok(true, 'components/logo-view.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/num-students-by-sq-ft.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/num-students-by-sq-ft.js should pass jshint', function() { 
    ok(true, 'components/num-students-by-sq-ft.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/palette-box.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/palette-box.js should pass jshint', function() { 
    ok(true, 'components/palette-box.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/sqft-dropdown.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/sqft-dropdown.js should pass jshint', function() { 
    ok(true, 'components/sqft-dropdown.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/student-age-dropdown.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/student-age-dropdown.js should pass jshint', function() { 
    ok(true, 'components/student-age-dropdown.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/student-count-dropdown.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/student-count-dropdown.js should pass jshint', function() { 
    ok(true, 'components/student-count-dropdown.js should pass jshint.'); 
  });

});
define('logo-maker/tests/components/teacher-requirements.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/teacher-requirements.js should pass jshint', function() { 
    ok(true, 'components/teacher-requirements.js should pass jshint.'); 
  });

});
define('logo-maker/tests/controllers/jurisdiction.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/jurisdiction.js should pass jshint', function() { 
    ok(true, 'controllers/jurisdiction.js should pass jshint.'); 
  });

});
define('logo-maker/tests/controllers/logo.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/logo.js should pass jshint', function() { 
    ok(true, 'controllers/logo.js should pass jshint.'); 
  });

});
define('logo-maker/tests/helpers/resolver', ['exports', 'ember/resolver', 'logo-maker/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('logo-maker/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('logo-maker/tests/helpers/start-app', ['exports', 'ember', 'logo-maker/app', 'logo-maker/router', 'logo-maker/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('logo-maker/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/MA.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/MA.js should pass jshint', function() { 
    ok(true, 'models/MA.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/flower.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/flower.js should pass jshint', function() { 
    ok(true, 'models/flower.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/font.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/font.js should pass jshint', function() { 
    ok(true, 'models/font.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/jurisdiction.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/jurisdiction.js should pass jshint', function() { 
    ok(true, 'models/jurisdiction.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/logo.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/logo.js should pass jshint', function() { 
    ok(true, 'models/logo.js should pass jshint.'); 
  });

});
define('logo-maker/tests/models/palette.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/palette.js should pass jshint', function() { 
    ok(true, 'models/palette.js should pass jshint.'); 
  });

});
define('logo-maker/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('logo-maker/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('logo-maker/tests/routes/jurisdiction/index.jshint', function () {

  'use strict';

  module('JSHint - routes/jurisdiction');
  test('routes/jurisdiction/index.js should pass jshint', function() { 
    ok(true, 'routes/jurisdiction/index.js should pass jshint.'); 
  });

});
define('logo-maker/tests/routes/jurisdiction/view.jshint', function () {

  'use strict';

  module('JSHint - routes/jurisdiction');
  test('routes/jurisdiction/view.js should pass jshint', function() { 
    ok(true, 'routes/jurisdiction/view.js should pass jshint.'); 
  });

});
define('logo-maker/tests/routes/new.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/new.js should pass jshint', function() { 
    ok(true, 'routes/new.js should pass jshint.'); 
  });

});
define('logo-maker/tests/test-helper', ['logo-maker/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('logo-maker/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/font-dropdown-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('font-dropdown', 'FontDropdownComponent', {});

  ember_qunit.test('it renders', function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, 'preRender');

    // appends the component to the page
    this.render();
    equal(component._state, 'inDOM');
  });

  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/font-dropdown-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/font-dropdown-test.js should pass jshint', function() { 
    ok(true, 'unit/components/font-dropdown-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/num-students-by-sq-ft-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('num-students-by-sq-ft', {});

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/num-students-by-sq-ft-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/num-students-by-sq-ft-test.js should pass jshint', function() { 
    ok(true, 'unit/components/num-students-by-sq-ft-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/sqft-dropdown-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('sqft-dropdown', {});

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/sqft-dropdown-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/sqft-dropdown-test.js should pass jshint', function() { 
    ok(true, 'unit/components/sqft-dropdown-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/student-age-dropdown-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('student-age-dropdown', {});

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/student-age-dropdown-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/student-age-dropdown-test.js should pass jshint', function() { 
    ok(true, 'unit/components/student-age-dropdown-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/student-count-dropdown-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('student-count-dropdown', {});

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/student-count-dropdown-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/student-count-dropdown-test.js should pass jshint', function() { 
    ok(true, 'unit/components/student-count-dropdown-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/components/teacher-requirements-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('teacher-requirements', {});

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });

  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('logo-maker/tests/unit/components/teacher-requirements-test.jshint', function () {

  'use strict';

  module('JSHint - unit/components');
  test('unit/components/teacher-requirements-test.js should pass jshint', function() { 
    ok(true, 'unit/components/teacher-requirements-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/models/flower-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('flower', 'Flower', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('logo-maker/tests/unit/models/flower-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/flower-test.js should pass jshint', function() { 
    ok(true, 'unit/models/flower-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/models/font-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('font', 'Font', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('logo-maker/tests/unit/models/font-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/font-test.js should pass jshint', function() { 
    ok(true, 'unit/models/font-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/models/logo-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('logo', 'Logo', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('logo-maker/tests/unit/models/logo-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/logo-test.js should pass jshint', function() { 
    ok(true, 'unit/models/logo-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/unit/models/palette-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('palette', 'Palette', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('logo-maker/tests/unit/models/palette-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/palette-test.js should pass jshint', function() { 
    ok(true, 'unit/models/palette-test.js should pass jshint.'); 
  });

});
define('logo-maker/tests/views/application.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/application.js should pass jshint', function() { 
    ok(true, 'views/application.js should pass jshint.'); 
  });

});
define('logo-maker/views/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].View.extend({
        classNames: ['l-full']
    });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('logo-maker/config/environment', ['ember'], function(Ember) {
  var prefix = 'logo-maker';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("logo-maker/tests/test-helper");
} else {
  require("logo-maker/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true,"name":"logo-maker","version":"0.0.0.20df650c"});
}

/* jshint ignore:end */
//# sourceMappingURL=logo-maker.map