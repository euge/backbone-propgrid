Propgrid.Select = {};
Propgrid.Select.Show = Propgrid.ValueShowBase.extend({

  attributes : { "class" : "propgrid-value-show propgrid-value-show-select" }

});
Propgrid.Select.Edit = Propgrid.ValueEditBase.extend({

  attributes : { "class" : "propgrid-value-edit propgrid-value-edit-select" },

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
  }

});