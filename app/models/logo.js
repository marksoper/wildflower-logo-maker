import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    font: DS.attr(),
    flowers: DS.attr(),
    palette: DS.attr(),
    arrangement: DS.attr(),
    stringified: DS.attr()
});
