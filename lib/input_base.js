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