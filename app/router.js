import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function() {
    this.route('new')
    this.route('view', {path: 'view/:logo_id'})
    this.route('logo', {path: '/:logo_id'})
})

export default Router
