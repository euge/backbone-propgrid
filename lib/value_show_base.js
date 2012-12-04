Propgrid.ValueShowBase = Propgrid.ValueBase.extend({

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