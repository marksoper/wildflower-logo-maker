/*global $*/
import Ember from 'ember';

export default Ember.Component.extend({
    classNames: 'grid-item',
    isBigPalette: function() {
        return this.get('palette.colors').length > 2
    }.property('palette.colors'),
    didInsertElement: function() {
        var spans = $(this.get('element')).find('span')

        this.get('palette.colors').forEach(function(color, i) {
            if ( $(spans[i]).hasClass('two-color') ) {
                if ( i === 0 ) {
                    $(spans[i]).css('border-bottom-color', color)
                } else {
                    $(spans[i]).css('border-top-color', color)
                }
            } else {
                $(spans[i]).css('background-color', color)
            }
        })
    },
    actions: {
        setPalette: function(palette) {
            this.sendAction('setPalette', palette)
        }
    }
})
