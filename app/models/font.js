import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    filename: DS.attr(),
    location: DS.attr()
});
