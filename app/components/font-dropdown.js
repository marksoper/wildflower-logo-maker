/*global $*/
import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        $(document).click(() => {
            this.get('element').classList.remove('active')
        })
    },
    id: 'filter',
    classNames: ['dropdown'],
    click: function() {
        this.get('element').classList.toggle('active')
        return false
    },
    actions: {
        selectFont: function(font) {
            this.sendAction('action', font)
        }
    }
})
