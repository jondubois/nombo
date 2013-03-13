/*
	Import stylesheet from framework/styles/ directory
	You can also import a .less stylesheet which will be pre-compiled on the serverside; In this case, make sure that your files have a .less extension
	Note that all nCombo framework files are stored under framework/ - App-specific files are stored under the app/ directory
*/

/**
 * Backbone localStorage Adapter
 * https://github.com/jeromegn/Backbone.localStorage
 */
 
(function () {
	var _ = this._;
	var Backbone = this.Backbone;

	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};

	function guid() {
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	};
	Backbone.LocalStorage = window.Store = function (name) {
		this.name = name;
		var store = this.localStorage().getItem(this.name);
		this.records = (store && store.split(",")) || [];
	};

	_.extend(Backbone.LocalStorage.prototype, {
		save: function () {
			this.localStorage().setItem(this.name, this.records.join(","));
		},
		create: function (model) {
			if (!model.id) {
				model.id = guid();
				model.set(model.idAttribute, model.id);
			}
			this.localStorage().setItem(this.name + "-" + model.id, JSON.stringify(model));
			this.records.push(model.id.toString());
			this.save();
			return model.toJSON();
		},
		update: function (model) {
			this.localStorage().setItem(this.name + "-" + model.id, JSON.stringify(model));
			if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString());
			this.save();
			return model.toJSON();
		},
		find: function (model) {
			return JSON.parse(this.localStorage().getItem(this.name + "-" + model.id));
		},
		findAll: function () {
			return _(this.records).chain()
				.map(function (id) {
				return JSON.parse(this.localStorage().getItem(this.name + "-" + id));
			}, this)
				.compact()
				.value();
		},
		destroy: function (model) {
			this.localStorage().removeItem(this.name + "-" + model.id);
			this.records = _.reject(this.records, function (record_id) {
				return record_id == model.id.toString();
			});
			this.save();
			return model;
		},

		localStorage: function () {
			return localStorage;
		}
	});
	Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function (method, model, options, error) {
		var store = model.localStorage || model.collection.localStorage;

		if (typeof options == 'function') {
			options = {
				success: options,
				error: error
			};
		}
		
		var resp;
		
		switch (method) {
			case "read":
				resp = model.id != undefined ? store.find(model) : store.findAll();
				break;
			case "create":
				resp = store.create(model);
				break;
			case "update":
				resp = store.update(model);
				break;
			case "delete":
				resp = store.destroy(model);
				break;
		}
		if(model.sim && method == 'read') {
			
			$n.local.exec(model.sim, method, function(err, data) {
				if(err) {
					options.error(model, "Record not found", options);
				} else {
					options.success(model, data, options);
				}
			});
		} else {
		
		if (resp) {
			options.success(model, resp, options);
		} else {
			options.error(model, "Record not found", options);
		}
		}
	};

	Backbone.ajaxSync = Backbone.sync;

	Backbone.getSyncMethod = function (model) {
		if (model.localStorage || (model.collection && model.collection.localStorage)) {
			return Backbone.localSync;
		}
		return Backbone.ajaxSync;
	};

	Backbone.sync = function (method, model, options, error) {
		return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
	};
})();

//Backbone.sync = function (method, model, options, error) {
	//$n.local.exec(model);
	//return null;
//};

/*
	Functions passed to $n.ready will only be run when all scripts grabbed before the current $n.ready call have finished loading
	Note that once inside $n.ready, you may choose to load other external scripts which can have their own $n.ready handlers
*/
$n.ready(function() {
	/*
		Add out main template to the DOM. Note that we don't need to wait for it to load asynchronously
		because it has already been bundled into our app by the server (see backbone/server.node.js).
	*/
	
	var mainTemplate = $n.grab.app.template('main.html');
	$(document.body).html(mainTemplate.render());

	var Todo = Backbone.Model.extend({
		defaults: function() {
			return {
				title: "empty todo...",
				order: Todos.nextOrder(),
				done: false
			};
		},
		initialize: function() {
			if (!this.get("title")) {
				this.set({"title": this.defaults().title});
			}
		},
		toggle: function() {
			this.save({done: !this.get("done")});
		}
	});
	
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		sim: 'Todos',
		localStorage: new Backbone.LocalStorage("todos-backbone"),
		done: function() {
			return this.filter(function(todo){ return todo.get('done'); });
		},
		remaining: function() {
			return this.without.apply(this, this.done());
		},
		nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: function(todo) {
			return todo.get('order');
		}
	});
	
	var Todos = new TodoList();
	var TodoView = Backbone.View.extend({
		tagName:  "li",
		template: _.template($('#item-template').html()),
		events: {
			"click .toggle"   : "toggleDone",
			"dblclick .view"  : "edit",
			"click a.destroy" : "clear",
			"keypress .edit"  : "updateOnEnter",
			"blur .edit"      : "close"
		},
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$('.edit');
			return this;
		},
		toggleDone: function() {
			this.model.toggle();
		},
		edit: function() {
			this.$el.addClass("editing");
			this.input.focus();
		},
		close: function() {
			var value = this.input.val();
			if (!value) {
				this.clear();
			} else {
				this.model.save({title: value});
				this.$el.removeClass("editing");
			}
		},
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
		},
		clear: function() {
			this.model.destroy();
		}
	});
	
	var AppView = Backbone.View.extend({
		el: $("#todoapp"),
		statsTemplate: _.template($('#stats-template').html()),
		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},
		initialize: function() {
			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'all', this.render);

			this.footer = this.$('footer');
			this.main = $('#main');

			Todos.fetch();
		},
		render: function() {
			var done = Todos.done().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
			} else {
				this.main.hide();
				this.footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},
		addOne: function(todo) {
			var view = new TodoView({model: todo});
			this.$("#todo-list").append(view.render().el);
		},
		addAll: function() {
			Todos.each(this.addOne, this);
		},
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;

			Todos.create({title: this.input.val()});
			this.input.val('');
		},
		clearCompleted: function() {
			_.invoke(Todos.done(), 'destroy');
			return false;
		},
		toggleAllComplete: function () {
			var done = this.allCheckbox.checked;
			Todos.each(function (todo) { todo.save({'done': done}); });
		}
	});
	
	var App = new AppView();
});
