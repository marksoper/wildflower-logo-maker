import Ember from 'ember';

export default Ember.Component.extend({
    classNamesBindings: ['class'],
    letters: function() {
        var letters = this.get('text').split(''),
            colors = this.get('palette').colors,
            colorsCount = colors.length

        return letters.map(function(letter, index) {
            return {
                letter: letter,
                colorStyle: 'color: ' + colors[index%colorsCount] + ';'
            }
        })
    }.property('palette', 'text')
})
