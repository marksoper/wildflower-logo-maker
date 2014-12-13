/*global fabric,$*/
import Ember from 'ember';

function placeFlower(flower, index) {

    fabric.Image.fromURL(flower.get('location'), function(img) {

        img.set({
            left: this.canvasFlowers.getLeft() + (50 * index),
            top: (this.canvas.height/2 - 35),
            hasBorders: false
        })

        this.canvasFlowers.addWithUpdate(img).centerH()

    }.bind(this))
}

export default Ember.Component.extend({
    tagName: 'canvas',
    didInsertElement: function() {
        var h = $('#content').height(),
            w = $('#content').width()

        this.canvas = new fabric.StaticCanvas(this.get('element'), {
            width: w,
            height: h
        })

        this.canvasFlowers = new fabric.Group([])
        this.canvasTitle = new fabric.Group([])
        this.canvasSubtitle = new fabric.Group([
            new fabric.Text('Montessori School', {
                left: 0,
                hasBorders: false
            })
        ], {
            visible: false
        })

        this.canvas
            .add(this.canvasFlowers)
            .add(this.canvasTitle)
            .add(this.canvasSubtitle)

        this.canvasFlowers.centerH()
        this.canvasTitle.centerH()
        this.canvasSubtitle.centerH()
    },
    updateName: Ember.observer('name', function(fc, prop) {
        if ( !this.canvasSubtitle.getVisible() ) {
            this.canvasSubtitle.setVisible(true)
        }

        var title = new fabric.Text(fc.get(prop), {
            left: 0,
            top: this.canvas.height/2 + 35,
            hasBorders: false
        })

        this.canvasTitle.remove.apply(this.canvasTitle, this.canvasTitle.getObjects())
        this.canvasTitle.addWithUpdate(title).centerH()

        this.canvasSubtitle.setTop( this.canvas.height/2 + (title.height + 35) )
    }),
    updateFlowers: Ember.observer('flowers', function(a) {
        var selectedFlowers = a.get('flowers')
        this.canvasFlowers.remove.apply(this.canvasFlowers, this.canvasFlowers.getObjects())
        selectedFlowers.forEach(placeFlower, this)
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
