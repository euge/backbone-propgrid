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
      this.trigger("show");
      return false;
    }
  },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value() + "'/>");
    return this;
  }

});