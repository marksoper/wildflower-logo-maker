import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('flower', 'Flower', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
