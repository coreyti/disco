Screw.Unit(function() {
  describe("Form", function() {
    var view, model;

    before(function() {
      template = Disco.inherit(Disco.Form, {
        form_content: function(builder, initial_attributes) {
          with(builder) {
            input_for('name');
          }
        }
      });

      view = Disco.build(template);
      
      model = { name: "Dumbo" };
      view.model = model;
    });
    
    describe("#input_for", function() {
      describe("when #load is called on the view", function() {
        it("populates input elements in the form based on attribute values in the #model", function() {
          input = view.find('input#model_name')
          expect(input.length).to(equal, 1);
          expect(input.val()).to(equal, "");
          view.load();
          expect(input.val()).to(equal, model.name);
        });
      });
      
      describe("when #save is called on the view", function() {
        it("stores input element values in the view's #model", function() {
          var new_model_name = "Elephant";
          input = view.find('input#model_name');
          input.val(new_model_name);
          expect(model.name).to(equal, "Dumbo");
          view.save();
          expect(model.name).to(equal, new_model_name);
        });
      });
    });
  });
});