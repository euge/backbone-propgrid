Propgrid.ValueShowBase = Propgrid.ValueBase.extend({

  events : {
    "click" : "_onClick"
  },

  constructor : function() {
    Propgrid.ValueShowBase.__super__.constructor.apply(this, arguments);

    // add show class
    this.$el.addClass("propgrid-value-show");
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