describe("Propgrid", function() {

  var elTest, model;

  beforeEach(function() {
    // create staging area for each test
    elTest = $("<div>")
    $("body").append(elTest);

    model = new Backbone.Model({ Name : "Joe", Age : 30, State : "CA" });
  });

  describe("Attributes", function() {

    it("should create an editor for all model attributes", function() {
      var editor = new Propgrid({ model : model });
      var elEditor = editor.render().$el;
      var propNames = elEditor.find("tr").map(function() {
        return $(this).data("attr");
      });

      expect(propNames.get()).to.equalAsSets(["Name", "Age", "State"]);
    });

    it("should create an editor for specific model attributes", function() {
      var editor = new Propgrid({ model : model, attrs : [ "Name", "Age" ] });
      var elEditor = editor.render().$el;
      var propNames = elEditor.find("tr").map(function() {
        return $(this).data("attr");
      });

      expect(propNames.get()).to.equalAsSets(["Name", "Age"]);
    });

  })

  describe("Events", function() {

    it("should present an editable input when clicked on and revert back", function() {
      var editor = new Propgrid({ model : model });
      elTest.append(editor.render().$el);

      expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(0);
      elTest.find("tr .propgrid-value-show").first().click();

      expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(1);

      elTest.find("tr .propgrid-value-edit:visible :input").blur();
      expect(elTest.find("tr .propgrid-value-edit:visible :input").length).to.equal(0);
    });

  });

  describe("Types", function() {

    describe("Text", function() {

      it("should default to text inputs", function() {
        var editor = new Propgrid({ model : model });
        elTest.append(editor.render().$el);

        expect(elTest.find(".propgrid-value-edit-text").length).to.equal(3);
      });

    });

    describe("Select", function() {

      it("should allow for the input type to be customized", function() {
        var editor = new Propgrid({
          model : model,
          attrs : [ "State" ],
          config : {
            "State": { type : "Select", values : [ "CA", "MD", "WA" ] }
          }
        });

        elTest.append(editor.render().$el);

        expect(elTest.find(".propgrid-value-edit-select").length).to.equal(1);

        elTest.find("tr .propgrid-value-show").first().click();
        var opts = elTest.find(".propgrid-value-edit-select option").map(function() {
          return $(this).val();
        });

        expect(opts.get()).to.equalAsSets([ "CA", "MD", "WA" ]);

      });

    });

  });

});