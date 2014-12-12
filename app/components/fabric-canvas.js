/*global fabric*/
import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'canvas',
    didInsertElement: function() {
        this.canvas = new fabric.Canvas(this.get('element'));
        //this.drawSomeStuffUsingCanvas();
    },
    updateName: Ember.observer('name', function(a, prop) {
        console.log(a.get(prop))
    }),
    updateFlowers: Ember.observer('flowers', function() {
        // this.canvas.update flowers
    }),
    updateFont: Ember.observer('font', function() {
        //this.canvas update font
    }),
    updatePalette: Ember.observer('palette', function() {
        //this.canvas update palette
    }),
    updateArrangement: Ember.observer('arrangement', function() {
        //this.canvas update arrangement
    })
})
