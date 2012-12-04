Propgrid.Select = {};
Propgrid.Select.Show = Propgrid.ShowBase;
Propgrid.Select.Edit = Propgrid.InputBase.extend({

  attributes : { "class" : "propgrid-value-edit propgrid-value-edit-select" },

  events : {
    "blur select" : "_onBlur",
    "keyup select" : "_onKeyUp",
    "keydown select" : "_onKeyDown"
  },

  render : function() {
    var i, l, opt, currValue = this.value(),
        select = $("<select>"), values = this.options.config.values || [];

    for (i = 0, l = values.length; i < l; ++i) {
      opt = $("<option>").val(values[i]).html(values[i]);

      if (values[i] === currValue) {
        opt.prop("selected", true);
      }

      select.append(opt);
    }

    this.$el.html(select);
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
    this.value(this.$("select").val());
  },

  focus : function() {
    this.$("select").focus();
    return this;
  }

});