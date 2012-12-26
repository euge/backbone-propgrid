Propgrid.ValueEditBase = Propgrid.ValueBase.extend({

  events : {
//     "blur :input" : "_onBlur",
     "keyup :input" : "_onKeyUp",
     "keydown :input" : "_onKeyDown"
   },

   constructor : function() {
     Propgrid.ValueEditBase.__super__.constructor.apply(this, arguments);

     // add edit class
     this.$el.addClass("propgrid-value-edit");
   },

  _onBlur : function(event) {
    console.log("blur", event)
    // set the new value and leave the edit view
    this._save();
    this.trigger("show");
    return false;
  },

  _onKeyUp : function(event) {
    if (event.keyCode === 27) {
      // handle the esc key event
      this.trigger("show");
      return false;
    } else if (event.keyCode === 13) {
      // handle the enter key event
      this._save();
      this.trigger("show");
      return false;
    }
  },

  _onKeyDown : function(event) {
    if (event.keyCode === 9) {
      // handle the tab key event
      this._save();
      this.trigger("next");
      return false;
    }
  },

  _save : function() {
    this.value(this.$(":input").val());
  },

  focus : function() {
    this.$(":input").focus();
    return this;
  }

});