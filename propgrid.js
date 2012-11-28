var Propgrid = Backbone.View.extend({
  
  tagName : "table",
  
  attributes : { "class" : "propgrid" },
  
  initialize : function() {
    
  },
  
  render : function() {
    for (var attr in this.model.attributes) {
      var itemView = new Propgrid.Item({ model : this.model, attr : attr });
      this.$el.append(itemView.render().$el);
    }
    
    return this;
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
    
    this.$(".attrValue").html(this.editView.render().$el);
  },
  
  _onShowMode : function() {
    if (this.editView) {
      this.editView.remove();
      this.editView.off();      
    }
    
    this.showView = new Propgrid.Text.Show({ model : this.model, attr : this.attr });    
    this.showView.on("edit", this._onEditMode, this);
    this.$(".attrValue").append(this.showView.render().$el);    
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
    "blur input" : "_onBlur"
  },
  
  initialize : function() {
    this.attr = this.options.attr;
    this.value = this.model.get(this.attr);
  },
  
  render : function() {
    this.$el.html("<input type='text' value='" + this.value + "'/>");
    return this;
  },
  
  _onBlur : function() {
    // set the new value and leave the edit view
    this.model.set(this.attr, this.$("input").val());
    this.trigger("show");
    return false;
  }
  
});

$(function() {
  var model = new Backbone.Model({ bob : "joe", euge : 10, name : "a" });
  var view = new Propgrid({ model : model });
  $("body").append(view.render().$el);
})
