Propgrid.ValueEditBase = Propgrid.ValueBase.extend({

  constructor : function() {
    this.events = _.extend(this.events || {}, {
      "keyup :input" : "_onKeyUp",
      "keydown :input" : "_onKeyDown"
    });

    Propgrid.ValueEditBase.__super__.constructor.apply(this, arguments);

    // add edit class
    this.$el.addClass("propgrid-value-edit");
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      // handle the esc key event
      this.blur().trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      // handle the enter key event
      this.save().blur().trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      // handle the tab key event
      event.preventDefault()
      this.save().blur().trigger("next");
    }
  },

  save : function() {
    this.value(this.$(":input").val());
    return this;
  },

  blur : function() {
    this.$(":input").blur();
    return this;
  },

  focus : function() {
    this.$(":input").focus();
    return this;
  }

});