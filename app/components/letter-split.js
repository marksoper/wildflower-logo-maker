import Ember from 'ember';

export default Ember.Component.extend({
    classNamesBindings: ['class'],
    letters: function() {
        var letters = this.get('text').split(''),
            colors = this.get('palette').colors,
            colorsCount = colors.length

        return letters.map((letter, index) => {
            var color

            if ( colorsCount === 2 ) {
                if ( this.get('text').match(/montessori/i) ) {
                    color = 'color: ' + colors[0] + ';'
                } else {
                    color = 'color: ' + colors[1] + ';'
                }
            } else {
                color = 'color: ' + colors[index%colorsCount] + ';'
            }

            return {
                letter: letter,
                colorStyle: color
            }
        })
    }.property('palette', 'text')
})
