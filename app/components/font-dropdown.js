import Ember from 'ember';

export default Ember.Component.extend({
    id: 'filter',
    active: false,
    classNames: ['dropdown'],
    classNameBindings: ['active'],
    click: function() {
        this.set('active', !this.get('active'))
        return false
    },
    actions: {
        selectFont: function(font) {
            this.sendAction('action', font)
        }
    }
})
