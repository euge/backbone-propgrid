var Propgrid = Backbone.View.extend({

  attributes : { "class" : "propgrid" },

  initialize : function() {
    _.bindAll(this, "_onBodyClick");

    $("body").on("click", this._onBodyClick);
  },

  render : function() {
    var i, l, attrs = this.options.attrs, rowView;

    // when specific attributes are not provided, use all model attributes
    if (!attrs) {
      attrs = _.keys(this.model.attributes);
    }

    if (!this.options.config) {
      this.options.config = {};
    }

    // create and configure views
    for (i = 0, l = attrs.length; i < l; ++i) {
      rowView = new Propgrid.Row({
        model : this.model,
        attr : attrs[i],
        config : this.options.config[attrs[i]] || {}
      });

      rowView.on("next", this._onNext, this);
      rowView.on("setActive", this._setActive, this);
      rowView.on("unsetActive", this._unsetActive, this);

      this.$el.append(rowView.render().$el);
      rowView.$el.data('rowView', rowView);
    }

    return this;
  },

  _onNext : function(rowView) {
    var next = this.$el.find(rowView.$el).next().data("rowView");

    // make the next input enter its edit mode if it exists
    if (next) {
      next.edit();
    }
  },

  _setActive : function(newActiveRow) {
    if (this._activeRow) {
      this._activeRow.save().show();
    }

    this._activeRow = newActiveRow;
  },

  _unsetActive : function(row) {
    // provided row is no longer the active one
    if (this._activeRow === row) {
      this._activeRow = null;
    }
  },

  _onBodyClick : function() {
    // essentially a "blur" that causes the active row to transition to "show" mode
    // when an unhandled click occurs
    if (this._activeRow) {
      this._activeRow.save().show();
    }
  }

});

Propgrid.Row = Backbone.View.extend({

  template : _.template("\
    <div class='propgrid-attr'><%= attr %></div> \
    <div class='propgrid-value'></div>"
  ),

  attributes : { "class" : "propgrid-row" },
  
  events : {
    "click .propgrid-attr" : "_onAttrClick"
  },

  initialize : function() {
    var klass = this._inputClass(),
        viewOpts = {
          model : this.model,
          attr : this.options.attr,
          config : this.options.config
        };

    this._showView = new klass.Show(viewOpts);
    this._editView = new klass.Edit(viewOpts);

    this._editView.on("show", this.show, this);
    this._showView.on("edit", this.edit, this);
    this._editView.on("next", this._onNext, this);
  },

  _inputClass : function() {
    var klass, type = this.options.config.type;

    if (!type) {
      type = "Text";
    }

    klass = Propgrid[type];

    if (!klass) {
      throw new Error("Type " + type + " not found");
    }

    return klass;
  },

  render : function() {
    this.$el.data("attr", this.options.attr);
    this.$el.append(this.template({ attr : this.options.attr }));
    this.$(".propgrid-value").
      append(this._showView.render().$el).
      append(this._editView.render().$el);

    this.show();
    return this;
  },

  edit : function() {
    console.log("edit")
    this._state = "edit";
    this._showView.hide();
    this._editView.render().show().focus();
    this.trigger("setActive", this);
  },

  show : function() {
    console.log("show")
    this._state = "show";
    this._editView.hide();
    this._showView.render().show();
    this.trigger("unsetActive", this);
  },

  save : function() {
    if (this._state === "edit") {
      this._editView.save();
    }
    return this;
  },

  blur : function() {
    if (this._state === "edit") {
      this._editView.blur();
    }
    return this;
  },

  _onNext : function() {
    this.show();
    this.trigger("next", this);
  },
  
  _onAttrClick : function() {
    console.log(this.options.attr);
    this.edit();
    return false;
  }

});
Propgrid.ValueBase = Backbone.View.extend({

  hide : function() {
    this.$el.hide();
    return this;
  },

  show : function() {
    this.$el.show();
    return this;
  },

  value : function(newValue) {
    if (_.isUndefined(newValue)) {
      // getter
      return this.model.get(this.options.attr);
    } else {
      // setter
      this.model.set(this.options.attr, newValue);
    }
  }

});
Propgrid.ValueShowBase = Propgrid.ValueBase.extend({

  constructor : function() {
    Propgrid.ValueShowBase.__super__.constructor.apply(this, arguments);

    // add show class
    this.$el.addClass("propgrid-value-show");
  },

  render : function() {
    this.$el.html(this.value());
    return this;
  }

});
Propgrid.ValueEditBase = Propgrid.ValueBase.extend({

  constructor : function() {
    this.events = _.extend(this.events || {}, {
      "keyup :input" : "_onKeyUp",
      "keydown :input" : "_onKeyDown"
    });

    Propgrid.ValueEditBase.__super__.constructor.apply(this, arguments);

    // add edit class
    this.$el.addClass("propgrid-value-edit");
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      // handle the esc key event
      this.blur().trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      // handle the enter key event
      this.save().blur().trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      // handle the tab key event
      event.preventDefault()
      this.save().blur().trigger("next");
    }
  },

  save : function() {
    this.value(this.$(":input").val());
    return this;
  },

  blur : function() {
    this.$(":input").blur();
    return this;
  },

  focus : function() {
    this.$(":input").focus();
    return this;
  }

});
Propgrid.Text = {};
Propgrid.Text.Show = Propgrid.ValueShowBase.extend({

  attributes : { "class" : "propgrid-value-show-text" },

  events : {
    "click" : "_onClick"
  },

  _onClick : function(event) {
    this.trigger("edit");
    return false;
  }

});
Propgrid.Text.Edit = Propgrid.ValueEditBase.extend({

  attributes : { "class" : "propgrid-value-edit-text" },

  events : {
    "click" : "_onClick"
  },

  _onClick : function(event) {
    if (!$(event.target).is(":input")) {
      this.save().trigger("show");
    }

    return false;
  },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value() + "'/>");
    return this;
  }

});
Propgrid.Select = {};
Propgrid.Select.Show = Propgrid.ValueShowBase.extend({

  attributes : { "class" : "propgrid-value-show-select" }

});
Propgrid.Select.Edit = Propgrid.ValueEditBase.extend({

  attributes : { "class" : "propgrid-value-edit-select" },

  render : function() {
    var i, l, opt, currValue = this.value(),
        select = $("<select>"), values = this.options.config.values || [];

    for (i = 0, l = values.length; i < l; ++i) {
      opt = $("<option>").val(values[i]).html(values[i]);

      if (values[i] === currValue) {
        opt.prop("selected", true);
      }

      select.append(opt);
    }

    this.$el.html(select);
    return this;
  }

});