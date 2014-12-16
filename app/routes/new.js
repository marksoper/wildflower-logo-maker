import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render('logo', {controller: 'logo'})
    },
    model: function() {
        return Ember.Object.create({
            flowerIds: [],
            name: '',
            palette: { id: 2 },
            arrangement: {},
            font: {}
        })
    },
    setupController: function(controller, model) {
        this.controllerFor('logo').set('model', model)
    }
})
