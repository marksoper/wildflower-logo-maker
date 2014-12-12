import Ember from 'ember';

var ApplicationController = Ember.ObjectController.extend({
    selectedFlowers: function() {
        var flowers = this.get('flowers')
        return flowers.filterBy('selected', true)
    }.property('flowers.@each.selected'),
    maxFlowers: function() {
        return this.get('selectedFlowers').length >= 3
    }.property('selectedFlowers')
})

export default ApplicationController
