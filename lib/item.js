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