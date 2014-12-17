import Ember from "ember";

export default Ember.Route.extend({
    model: function() {
        return {
            flowers : (function() {
                var f = []
                for (var i = 1; i < 21; i++) {
                    f.push( Ember.Object.create({
                        location: '/assets/img/flower' + i + '.png',
                        id: i
                    }) )
                }
                return f
            })(),
            fonts: [Ember.Object.create({
                name: "Georgia",
                className: "georgia",
                id: 1
            }),Ember.Object.create({
                name: "Helvetica",
                className: "helvetica",
                id: 2
            }),Ember.Object.create({
                name: "Times New Roman",
                className: "times",
                id: 3
            })],
            palettes : [Ember.Object.create({
                id: 1,
                colors: ["#1ab6f5", "#1a86f5"]
            }), Ember.Object.create({
                id: 2,
                colors: ["#079d66","#73c412"]
            }), Ember.Object.create({
                id: 3,
                colors: ["#e5b113","#e57613"]
            }), Ember.Object.create({
                id: 4,
                colors: ["#4f03fc","#893cfd"]
            }), Ember.Object.create({
                id: 5,
                colors: ["#bb6de1","#9f37b5"]
            }), Ember.Object.create({
                id: 6,
                colors: ['#ff3c00', '#e5b113', '#e57613', '#cb0ab2', '#c0b405', '#7cc005']
            }), Ember.Object.create({
                id: 7,
                colors: ['#079d66', '#73c412', '#e5b113', '#e57613', '#fc5c05', '#c0b405']
            }), Ember.Object.create({
                id: 8,
                colors: ['#bb6de1', '#c91153', '#cb0ab2', '#6363f3', '#3093f8', '#044ed5']
            })],
            arrangements: [Ember.Object.create({
                id: 1,
                className: 'top'
            }), Ember.Object.create({
                id: 2,
                className: 'bottom'
            }), Ember.Object.create({
                id: 3,
                className: 'left'
            }), Ember.Object.create({
                id: 4,
                className: 'right'
            })]
        }
    }
})
