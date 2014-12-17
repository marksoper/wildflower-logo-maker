import Ember from "ember";

export default Ember.Route.extend({
    model: function() {
        return {
            flowers : (function() {
                var f = []
                for (var i = 1; i < 21; i++) {
                    f.push( Ember.Object.create({
                        location: '/assets/img/flower' + i + '.png',
                        selected: false,
                        id: i
                    }) )
                }
                return f
            })(),
            fonts: [Ember.Object.create({
                name: "Georgia",
                className: "georgia",
                selected: false,
                id: 1
            }),Ember.Object.create({
                name: "Helvetica",
                className: "helvetica",
                selected: false,
                id: 2
            }),Ember.Object.create({
                name: "Times New Roman",
                className: "times",
                selected: false,
                id: 3
            })],
            palettes : [Ember.Object.create({
                id: 1,
                selected: false,
                colors: ["#9D5F8F", "#74B48C"]
            }), Ember.Object.create({
                id: 2,
                selected: false,
                colors: ["#88C8C0","#6CD476"]
            }), Ember.Object.create({
                id: 3,
                selected: false,
                colors: ["#6BA056","#7DC5FD","#019897","#7DFCAC","#4AAF17","#E2F0AF"]
            }), Ember.Object.create({
                id: 4,
                selected: false,
                colors: ["#EBD0D1","#FD46CD","#F4417F","#C5BBF8","#B88A76","#ADB2E0"]
            })],
            arrangements: [Ember.Object.create({
                id: 1,
                name: 'top'
            }), Ember.Object.create({
                id: 2,
                name: 'bottom'
            }), Ember.Object.create({
                id: 3,
                name: 'left'
            }), Ember.Object.create({
                id: 4,
                name: 'right'
            })]
        }
    }
})
