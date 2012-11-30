var Propgrid = Backbone.View.extend({

  tagName : "table",

  attributes : { "class" : "propgrid" },

  initialize : function() {

  },

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
      next._onEditMode();
    }
  }



});

Propgrid.Item = Backbone.View.extend({

  tagName : "tr",

  initialize : function() {
    this.attr = this.options.attr;
  },

  render : function() {
    this.$el.append("<td class='attrName'></td><td class='attrValue'></td>");
    this.$(".attrName").html(this.attr)

    this._onShowMode();
    return this;
  },

  _onEditMode : function() {
    if (this.showView) {
      this.showView.remove();
      this.showView.off();
    }

    this.editView = new Propgrid.Text.Edit({ model : this.model, attr : this.attr });
    this.editView.on("show", this._onShowMode, this);
    this.editView.on("nextItem", this._onNextItem, this);

    this.$(".attrValue").html(this.editView.render().$el);
    this.editView.focus();
  },

  _onShowMode : function() {
    if (this.editView) {
      this.editView.remove();
      this.editView.off();
    }

    this.showView = new Propgrid.Text.Show({ model : this.model, attr : this.attr });
    this.showView.on("edit", this._onEditMode, this);
    this.$(".attrValue").append(this.showView.render().$el);
  },

  _onNextItem : function() {
    this._onShowMode();
    this.trigger("nextItem", this);
  }

});

Propgrid.Text = {};
Propgrid.Text.Show = Backbone.View.extend({

  events : {
    "click" : "_onClick"
  },

  initialize : function() {
    this.attr = this.options.attr;
    this.value = this.model.get(this.attr);
  },

  render : function() {
    this.$el.html(this.value);
    return this;
  },

  _onClick : function() {
    this.trigger("edit")
    return false;
  }

});

Propgrid.Text.Edit = Backbone.View.extend({

  events : {
    "blur input" : "_onBlur",
    "keyup input" : "_onKeyUp",
    "keydown input" : "_onKeyDown"
  },

  initialize : function() {
    this.attr = this.options.attr;
    this.value = this.model.get(this.attr);
  },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value + "'/>");
    return this;
  },

  _onBlur : function(event) {
    // set the new value and leave the edit view
    this._saveValue();
    this.trigger("show");
    return false;
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      this.trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      this._saveValue();
      this.trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      this._saveValue();
      this.trigger("nextItem");
      return false;
    }
  },

  _saveValue : function() {
    this.model.set(this.attr, this.$("input").val());
  },

  focus : function() {
    this.$("input").focus();
  }

});

$(function() {
  var model = new Backbone.Model({ bob : "joe", euge : 10, name : "a" });
  var view = new Propgrid({ model : model });
  $("body").append(view.render().$el);
})
