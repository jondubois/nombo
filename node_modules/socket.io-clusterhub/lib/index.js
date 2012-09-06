
/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Store = require('./store')
  , assert = require('assert')
  , hub = require('clusterhub')

/**
 * Exports the constructor.
 */

exports = module.exports = Hub;
Hub.Client = Client;

/**
 * Hub store.
 *
 * @api public
 */

function Hub (id) {
  this.hub = hub.createHub(id || 'socket.io-clusterhub');
  Store.call(this, {});
  this.setMaxListeners(0);
};

/**
 * Inherits from Store.
 */

Hub.prototype.__proto__ = Store.prototype;

/**
 * Publishes a message.
 *
 * @api private
 */

Hub.prototype.publish = function () {
  var args = Array.prototype.slice.call(arguments);
  this.hub.broadcast.apply(this.hub, args);
  this.emit.apply(this, ['publish'].concat(args));
};

/**
 * Subscribes to a channel
 *
 * @api private
 */

Hub.prototype.subscribe = function (name, consumer, fn) {
  if (consumer) this.hub.on(name, consumer);
  if (fn) fn();
  this.emit('subscribe', name, consumer, fn);
};

/**
 * Unsubscribes
 *
 * @api private
 */

Hub.prototype.unsubscribe = function (name, fn) {
  if (fn) this.hub.off(name, fn);
  this.emit('unsubscribe', name, fn);
};

/**
 * Destroys the store
 *
 * @api public
 */

Hub.prototype.destroy = function () {
  Store.prototype.destroy.call(this);
  this.hub.die();
};

/**
 * Client constructor
 *
 * @api private
 */

function Client (store, id) {
  Store.Client.call(this, store.hub, id);
};

/**
 * Inherits from Store.Client
 */

Client.prototype.__proto__ = Store.Client;

/**
 * Hub hash get
 *
 * @api private
 */

Client.prototype.get = function (key, fn) {
  this.store.hget(this.id, key, function() {
    var args = Array.prototype.slice.call(arguments);
    fn.apply(this, [null].concat(args));
  });
  return this;
};

/**
 * Hub hash set
 *
 * @api private
 */

Client.prototype.set = function (key, value, fn) {
  this.store.hset(this.id, key, value, function() {
    var args = Array.prototype.slice.call(arguments);
    fn.apply(this, [null].concat(args));
  });
  return this;
};

/**
 * Hub hash del
 *
 * @api private
 */

Client.prototype.del = function (key, fn) {
  this.store.hdel(this.id, key, function() {
    var args = Array.prototype.slice.call(arguments);
    fn.apply(this, [null].concat(args));
  });
  return this;
};

/**
 * Hub hash has
 *
 * @api private
 */

Client.prototype.has = function (key, fn) {
  this.store.hexists(this.id, key, function() {
    var args = Array.prototype.slice.call(arguments);
    fn.apply(this, [null].concat(args));
  });
  return this;
};

/**
 * Destroys client
 *
 * @param {Number} number of seconds to expire data
 * @api private
 */

Client.prototype.destroy = function (expiration) {
  if ('number' != typeof expiration) {
    this.store.del(this.id);
  } else {
    this.store.expire(this.id, expiration);
  }

  return this;
};
