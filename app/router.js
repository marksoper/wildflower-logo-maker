import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function() {
  this.route('new', {path: '/'});
  this.route('view', {path: 'view/:logo_id'});
  this.route('logo', {path: '/:logo_id'});
  this.route('jurisdiction', { path: 'licensing' }, function() {
    this.route('view', {path: ':jurisdiction_id'});
    this.route('qualifications', {path: ':jurisdiction_id/qualifications'});
  });
})

export default Router
