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