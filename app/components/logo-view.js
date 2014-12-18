import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['logo'],
    classNameBindings: ['arrangement', 'size'],
    attributeBindings: ['main:id'],
    main: function() {
        return this.get('view') === 'main' ? 'logo' : ''
    }.property('view')
})
