import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],

    inventory: function() {
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
        var allFlowers = this.get('inventory.flowers'),
            flowerIds = this.get('flowerIds')

        allFlowers.forEach(function(flower) {
            flower.set('selected', false)
        })

        return flowerIds.map(function(id) {
            var f = allFlowers.findBy('id', id)
            f.set('selected', true)
            return f
        })
    }.property('flowerIds.[]', 'inventory.flowers.[]'),

    letterList : function() {
        var letters = this.get('name').split(''),
            colors = this.get('palette'),
            colorsCount = colors.length

                debugger;
        return letters.map(function(letter, index) {
            return {
                letter: letter,
                colorStyle: 'color: ' + colors[index%colorsCount] + ';'
            }
        })
    }.property('palette', 'name'),

    subtitle: function() {
        var subtitle = ('Montessori School').split(''),
            colors = this.get('palette'),
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
            this.set('palette', palette)

            this.get('inventory.palettes').forEach(function(palette) {
                palette.set('selected', false)
            })
            palette.set('selected', true)
        }
    }
})
