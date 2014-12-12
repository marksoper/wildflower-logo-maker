import Ember from "ember";


export default Ember.Route.extend({
    setupController: function(controller) {
        controller.set('model', {
            flowers : (function() {
                var f = []
                for (var i = 1; i < 9; i++) {
                    f.push( Ember.Object.create({
                        location: '/assets/img/flower' + i + '.jpeg',
                        selected: false
                    }) )
                }
                return f
            })(),
            logo : Ember.Object.create({
                //selectedFlowers: Ember.computed.alias('flowers.selected')
            }),
            fonts: [{
                title: "Wild Child",
                id: 1
                },{
                title: "Helvetica",
                id: 2
            }],
            palettes : [{
                colors: ["#9D5F8F", "#74B48C"]
            }, {
                colors: ["#88C8C0","#6CD476"]
            }, {
                colors: ["#6BA056","#7DC5FD","#019897","#7DFCAC","#4AAF17","#E2F0AF"]
            }, {
                colors: ["#EBD0D1","#FD46CD","#F4417F","#C5BBF8","#B88A76","#ADB2E0"]
            }]
        })
    },
    actions: {
        toggleFlower: function(flower) {
            flower.set('selected', !flower.selected)
            console.log(this.controller.get('selectedFlowers'))
        }
    }
})
