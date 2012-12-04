Propgrid.Text = {};
Propgrid.Text.Show = Propgrid.ShowBase;
Propgrid.Text.Edit = Propgrid.InputBase.extend({

  attributes : { "class" : "propgrid-value-edit propgrid-value-edit-text" },

  events : {
    "blur input" : "_onBlur",
    "keyup input" : "_onKeyUp",
    "keydown input" : "_onKeyDown"
  },

  render : function() {
    this.$el.html("<input type='text' value='" + this.value() + "'/>");
    return this;
  },

  _onBlur : function(event) {
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
      this.trigger("nextItem");
      return false;
    }
  },

  _save : function() {
    this.value(this.$("input").val());
  },

  focus : function() {
    this.$("input").focus();
    return this;
  }

});