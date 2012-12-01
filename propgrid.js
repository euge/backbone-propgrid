var Propgrid = Backbone.View.extend({

  tagName : "table",

  attributes : { "class" : "propgrid" },

  render : function() {
    for (var attr in this.model.attributes) {
      var itemView = new Propgrid.Item({ model : this.model, attr : attr });
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
    this._showView = new Propgrid.Text.Show({ model : this.model, attr : this.options.attr });
    this._editView = new Propgrid.Text.Edit({ model : this.model, attr : this.options.attr });

    this._editView.on("show", this.show, this);
    this._showView.on("edit", this.edit, this);
    this._editView.on("nextItem", this._onNextItem, this);
  },

  render : function() {
    this.$el.append("<td class='attrName'>" + this.options.attr + "</td><td class='attrValue'></td>");
    this.$(".attrValue").
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

Propgrid.Text = {};
Propgrid.Text.Show = Propgrid.InputBase.extend({

  events : {
    "click" : "_onClick"
  },

  render : function() {
    this.$el.html(this.value());
    return this;
  },

  _onClick : function() {
    this.trigger("edit")
    return false;
  }

});

Propgrid.Text.Edit = Propgrid.InputBase.extend({

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

$(function() {
  var model = new Backbone.Model({ bob : "joe", euge : 10, name : "a" });
  var view = new Propgrid({ model : model });
  $("body").append(view.render().$el);
})
