var Propgrid = Backbone.View.extend({

  tagName : "table",

  attributes : { "class" : "propgrid" },

  render : function() {
    var i, l, attrs = this.options.attrs, itemView;

    // when specific attributes are not provided, use all model attributes
    if (!attrs) {
      attrs = _.keys(this.model.attributes);
    }

    if (!this.options.config) {
      this.options.config = {};
    }

    // create and configure views
    for (i = 0, l = attrs.length; i < l; ++i) {
      itemView = new Propgrid.Item({
        model : this.model,
        attr : attrs[i],
        config : this.options.config[attrs[i]] || {}
      });

      itemView.on("nextItem", this._onNextItem, this);
      this.$el.append(itemView.render().$el);
      itemView.$el.data('itemView', itemView);
    }

    return this;
  },

  _onNextItem : function(itemView) {
    var next = this.$el.find(itemView.$el).next().data("itemView");

    // make the next input enter its edit mode if it exists
    if (next) {
      next.edit();
    }
  }

});

Propgrid.Item = Backbone.View.extend({

  tagName : "tr",

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
    this._editView.on("nextItem", this._onNextItem, this);
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
    this.$el.append("<td class='propgrid-attr'>" + this.options.attr + "</td><td class='propgrid-value'></td>");
    this.$(".propgrid-value").
      append(this._showView.render().$el).
      append(this._editView.render().$el);

    this.show();
    return this;
  },

  edit : function() {
    this._showView.hide();
    this._editView.render().show().focus();
  },

  show : function() {
    this._editView.hide();
    this._showView.render().show();
  },

  _onNextItem : function() {
    this.show();
    this.trigger("nextItem", this);
  }

});

Propgrid.InputBase = Backbone.View.extend({

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

Propgrid.ShowBase = Propgrid.InputBase.extend({

  attributes : { "class" : "propgrid-value-show" },

  events : {
    "click" : "_onClick"
  },

  render : function() {
    this.$el.html(this.value());
    return this;
  },

  _onClick : function() {
    this.trigger("edit");
    return false;
  }

});

Propgrid.Text = {};
Propgrid.Text.Show = Propgrid.ShowBase;
Propgrid.Text.Edit = Propgrid.InputBase.extend({

  attributes : { "class" : "propgrid-value-edit propgrid-value-edit-text" },

  events : {
    "blur input" : "_onBlur",
    "keyup input" : "_onKeyUp",
    "keydown input" : "_onKeyDown"
  },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value() + "'/>");
    return this;
  },

  _onBlur : function(event) {
    // set the new value and leave the edit view
    this._save();
    this.trigger("show");
    return false;
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      // handle the esc key event
      this.trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      // handle the enter key event
      this._save();
      this.trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      // handle the tab key event
      this._save();
      this.trigger("nextItem");
      return false;
    }
  },

  _save : function() {
    this.value(this.$("input").val());
  },

  focus : function() {
    this.$("input").focus();
    return this;
  }

});


Propgrid.Select = {};
Propgrid.Select.Show = Propgrid.ShowBase;
Propgrid.Select.Edit = Propgrid.InputBase.extend({

  attributes : { "class" : "propgrid-value-edit propgrid-value-edit-select" },

  events : {
    "blur select" : "_onBlur",
    "keyup select" : "_onKeyUp",
    "keydown select" : "_onKeyDown"
  },

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
  },

  _onBlur : function(event) {
    // set the new value and leave the edit view
    this._save();
    this.trigger("show");
    return false;
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      // handle the esc key event
      this.trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      // handle the enter key event
      this._save();
      this.trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      // handle the tab key event
      this._save();
      this.trigger("nextItem");
      return false;
    }
  },

  _save : function() {
    this.value(this.$("select").val());
  },

  focus : function() {
    this.$("select").focus();
    return this;
  }

});
