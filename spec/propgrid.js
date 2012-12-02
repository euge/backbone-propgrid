function getEl() {
  var el = $("<div>")
  $("body").append(el);
  return el;
}

describe("PropertyGrid", function() {
    
  it("should create an editor for all model attributes", function() {
    var model = new Backbone.Model({ Name : "Joe", Age : 30, State : "CA" });
    var editor = new Propgrid({ model : model });
    
    var el = editor.render().$el;
    var propNames = el.find("tr .propgrid-attr-name").map(function() {
      return $(this).text();
    });
    
    expect(propNames.get().sort()).to.equalAsSets(["Name", "Age", "State"].sort());
  });
  
  it("should create an editor for specific model attributes", function() {
    var model = new Backbone.Model({ Name : "Joe", Age : 30, State : "CA" });
    var editor = new Propgrid({ model : model, attrs : [ "Name", "Age" ] });
    
    var el = editor.render().$el;
    var propNames = el.find("tr .propgrid-attr-name").map(function() {
      return $(this).text();
    });
    
    expect(propNames.get().sort()).to.equalAsSets(["Name", "Age"].sort());
  });
  
});