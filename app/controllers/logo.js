/*global html2canvas,$*/
import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],

    globalChoices: function() {
        var inventory = this.get('controllers.application').get('model'),
            palette = inventory.palettes.findBy('id', this.get('palette').id),
            arrangement = inventory.arrangements.findBy('id', this.get('arrangement').id),
            font = inventory.fonts.findBy('id', this.get('font').id)

        if ( palette ) { palette.set('selected', true) }
        if ( arrangement ) { arrangement.set('selected', true) }
        if ( font ) { font.set('selected', true) }

        return inventory
    }.property('controllers.application'),

    flowerObjects: function() {
        var allFlowers = this.get('globalChoices.flowers'),
            flowerIds = this.get('flowerIds')

        allFlowers.forEach(function(flower) {
            flower.set('selected', false)
        })

        return flowerIds.map(function(id) {
            var f = allFlowers.findBy('id', id)
            f.set('selected', true)
            return f
        })
    }.property('flowerIds.[]', 'globalChoices.flowers.[]'),

    actions: {
        saveFlower: function() {
            html2canvas($('#logo').get(0), {
                onrendered: function(canvas) {
                    this.set('stringified', canvas.toDataURL())
                   setTimeout(function() {$('#download').get(0).click()}, 0)
                }.bind(this)
            })
        },

        toggleFlower: function(flower) {
            var ids = this.get('flowerIds')
          if (ids.length < 3 || flower.get('selected')) {

              var i = ids.indexOf(flower.get('id'))
              if ( i === -1 ) {
                  ids.pushObject(flower.get('id'))
              } else {
                  ids.replace(i, 1)
              }
          }
        },

        setPalette: function(palette) {
            this.set('palette', palette)

            this.get('globalChoices.palettes').forEach(function(palette) {
                palette.set('selected', false)
            })
            palette.set('selected', true)
        }
    }
})
