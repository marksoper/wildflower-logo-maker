import Ember from "ember";

var flowers = []

for (var i = 1; i < 9; i++) {
    flowers[i-1] = {
        location : '/assets/img/flower' + i + '.jpeg'
    }
}

export default Ember.Route.extend({
    model: function() {
        return {
            flowers: flowers,
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
        }
    }
})
