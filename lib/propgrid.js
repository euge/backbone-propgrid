var Propgrid = Backbone.View.extend({

  tagName : "table",

  attributes : { "class" : "propgrid" },
  
  initialize : function() {
    _.bindAll(this, "_onBodyClick");
    
    $("body").on("click", this._onBodyClick);
  },

  render : function() {
    var i, l, attrs = this.options.attrs, rowView;

    // when specific attributes are not provided, use all model attributes
    if (!attrs) {
      attrs = _.keys(this.model.attributes);
    }

    if (!this.options.config) {
      this.options.config = {};
    }

    // create and configure views
    for (i = 0, l = attrs.length; i < l; ++i) {
      rowView = new Propgrid.Row({
        model : this.model,
        attr : attrs[i],
        config : this.options.config[attrs[i]] || {}
      });

      rowView.on("next", this._onNext, this);
      rowView.on("setActive", this._setActive, this);
      rowView.on("unsetActive", this._unsetActive, this);
      
      this.$el.append(rowView.render().$el);
      rowView.$el.data('rowView', rowView);
    }

    return this;
  },

  _onNext : function(rowView) {
    var next = this.$el.find(rowView.$el).next().data("rowView");

    // make the next input enter its edit mode if it exists
    if (next) {
      next.edit();
    }
  },
  
  _setActive : function(newActiveRow) {
    console.log(this._activeRow, newActiveRow);
    
    if (this._activeRow) {
      this._activeRow.show();
    }
    
    this._activeRow = newActiveRow;
  },
  
  _unsetActive : function(row) {
    // provided row is no longer the active one
    if (this._activeRow === row) {
      this._activeRow = null;
    }
  },
  
  _onBodyClick : function() {
    // essentially a "blur" that causes the active row to transition to "show" mode
    // when an unhandled click occurs
    if (this._activeRow) {
      this._activeRow.show();
    }
  }

});
