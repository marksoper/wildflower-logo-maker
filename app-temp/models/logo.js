import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    font: DS.attr(),
    flowerIds: DS.attr(),
    palette: DS.attr(),
    arrangement: DS.attr()
});
