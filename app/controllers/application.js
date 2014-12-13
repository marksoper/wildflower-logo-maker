import Ember from 'ember';

var ApplicationController = Ember.ObjectController.extend({
    selectedFlowers: function() {
        var flowers = this.get('flowers')
        return flowers.filterBy('selected', true)
    }.property('flowers.@each.selected'),

    actions: {
        toggleFlower: function(flower) {
          if (this.get('selectedFlowers.length') < 3 || flower.get('selected')) {
              flower.set('selected', !flower.selected);
          }
        }
    }

})

export default ApplicationController
