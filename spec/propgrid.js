describe("PropertyGrid", function() {
  
  var elTest, model;
  
  beforeEach(function() {
    // create staging area for each test
    elTest = $("<div>")
    $("body").append(elTest);
    
    model = new Backbone.Model({ Name : "Joe", Age : 30, State : "CA" });
  });
    
  it("should create an editor for all model attributes", function() {
    var editor = new Propgrid({ model : model });
    var elEditor = editor.render().$el;
    var propNames = elEditor.find("tr .propgrid-attr").map(function() {
      return $(this).text();
    });
    
    expect(propNames.get().sort()).to.equalAsSets(["Name", "Age", "State"].sort());
  });
  
  it("should create an editor for specific model attributes", function() {
    var editor = new Propgrid({ model : model, attrs : [ "Name", "Age" ] });    
    var elEditor = editor.render().$el;
    var propNames = elEditor.find("tr .propgrid-attr").map(function() {
      return $(this).text();
    });
    
    expect(propNames.get().sort()).to.equalAsSets(["Name", "Age"].sort());
  });
  
  it("should present an editable input when clicked on and revert back", function() {
    var editor = new Propgrid({ model : model });
    elTest.append(editor.render().$el);
    
    expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(0);
    elTest.find("tr .propgrid-value-show").first().click();

    expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(1);
    
    elTest.find("tr .propgrid-value-edit:visible :input").blur();
    expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(0);    
  })
    
});