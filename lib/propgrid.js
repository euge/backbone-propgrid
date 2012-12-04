var Propgrid = Backbone.View.extend({

  tagName : "table",

  attributes : { "class" : "propgrid" },

  render : function() {
    var i, l, attrs = this.options.attrs, itemView;

    // when specific attributes are not provided, use all model attributes
    if (!attrs) {
      attrs = _.keys(this.model.attributes);
    }

    if (!this.options.config) {
      this.options.config = {};
    }

    // create and configure views
    for (i = 0, l = attrs.length; i < l; ++i) {
      itemView = new Propgrid.Item({
        model : this.model,
        attr : attrs[i],
        config : this.options.config[attrs[i]] || {}
      });

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
