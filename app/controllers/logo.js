/*global html2canvas,$*/
import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['application'],

    inventory: function() {
        var inventory = this.get('controllers.application').get('model'),
            palette = inventory.palettes.findBy('id', this.get('palette').id),
            arrangement = inventory.arrangements.findBy('id', this.get('arrangement').id)

        if ( palette ) { palette.set('selected', true) }
        if ( arrangement ) { arrangement.set('selected', true) }

        return inventory
    }.property('controllers.application'),

    selectedFont: function() {
        return this.get('inventory').fonts.findBy('id', this.get('font'))
    }.property('inventory', 'font'),

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

    actions: {
        saveFlower: function() {
            html2canvas($('#logo').get(0), {
                onrendered: (canvas) => {
                    this.set('dataurl', canvas.toDataURL())
                    setTimeout(() => $('#download').get(0).click(), 0)
                }
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

            this.get('inventory.palettes').forEach(function(palette) {
                palette.set('selected', false)
            })

            palette.set('selected', true)
        },

        setArrangement: function(a) {
            this.set('arrangement', a)

            this.get('inventory.arrangements').forEach(function(a) {
                a.set('selected', false)
            })

            a.set('selected', true)
        },

        setFont: function(font) {
            this.set('font', font.id)
        }
    }
})
