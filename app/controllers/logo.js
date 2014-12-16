import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],

    globalChoices: function() {
        var inventory = this.get('controllers.application').get('model')
            //palettes = inventory.palettes

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

    letterList : function() {
        var letters = this.get('name').split(''),
            colors = this.get('palette') || [],
            colorsCount = colors.length

        return letters.map(function(letter, index) {
            return {
                letter: letter,
                colorStyle: 'color: ' + colors[index%colorsCount] + ';'
            }
        })
    }.property('palette', 'name'),

    subtitle: function() {
        var subtitle = ('Montessori School').split(''),
            colors = this.get('palette') || [],
            colorsCount = colors.length

        if ( !this.get('name') ) {
            return ''
        } else {
            return subtitle.map(function(letter, index) {
                return {
                    letter: letter,
                    colorStyle: 'color: ' + colors[index%colorsCount] + ';'
                }
            })
        }
    }.property('palette', 'name'),

    actions: {
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
            this.set('palette', palette.get('colors'))

            this.get('globalChoices.palettes').forEach(function(palette) {
                palette.set('selected', false)
            })
            palette.set('selected', true)
        }
    }
})
