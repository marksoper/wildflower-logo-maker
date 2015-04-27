import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function() {
  this.route('new', {path: '/'});
  this.route('view', {path: 'view/:logo_id'});
  this.route('logo', {path: '/:logo_id'});
  this.resource('jurisdiction', { path: "licensing/:jurisdiction_id" }, function() {});
  this.resource('jurisdictions', { path: "licensing/" }, function() {});
})

export default Router
