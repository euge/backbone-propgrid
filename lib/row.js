Propgrid.Row = Backbone.View.extend({

  template : _.template("\
    <td class='propgrid-attr'> \
      <%= attr %> \
    </td> \
    <td class='propgrid-value'> \
    </td>"
  ),

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
    this._showView.hide();
    this._editView.render().show().focus();
  },

  show : function() {
    this._editView.hide();
    this._showView.render().show();
  },

  _onNext : function() {
    this.show();
    this.trigger("next", this);
  }

});