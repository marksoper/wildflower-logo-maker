import Ember from 'ember';

function linearMap(low1, hi1, point1, low2, hi2) {
    var point2

    point2 = (low2*point1 - low1*low2 + hi1*hi2 - hi2*point1) / ( hi1 - low1 )
    return point2
}

export default Ember.Component.extend({
    classNamesBindings: ['class'],
    attributeBindings: ['style'],
    style: function() {
        if ( this.get('text').match(/montessori/i) || this.get('size') === 'small' ) {
            return ''
        }

        var letterCount = this.get('text').length,
            sizeRange = [48, 110],
            countRange = [5, 13],
            size

        if ( letterCount <= 5 ) {
            size = Math.max.apply(null, sizeRange)
        } else if ( letterCount >= 13 ) {
            size = Math.min.apply(null, sizeRange)
        } else {
            size = linearMap(countRange[0], countRange[1], letterCount, sizeRange[0], sizeRange[1])
        }

        return `font-size: ${size}px;`
    }.property('text'),
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
