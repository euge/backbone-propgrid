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