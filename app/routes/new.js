import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render('logo', {controller: 'logo'})
    },
    model: function() {
        return Ember.Object.create({
            flowerIds: [],
            name: '',
            arrangement: { id: null, name: null },
            font: { id: 3, name: "Times New Roman" },
            palette: { id: null, colors: [] }
        })
    },
    setupController: function(controller, model) {
        this.controllerFor('logo').set('model', model)
    }
})
