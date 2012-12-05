Propgrid.Text = {};
Propgrid.Text.Show = Propgrid.ValueShowBase.extend({

  attributes : { "class" : "propgrid-value-show-text" }

});
Propgrid.Text.Edit = Propgrid.ValueEditBase.extend({

  attributes : { "class" : "propgrid-value-edit-text" },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value() + "'/>");
    return this;
  }

});