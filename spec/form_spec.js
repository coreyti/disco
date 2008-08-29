Screw.Unit(function() {
  describe("Form", function() {
    var builder_passed_to_form_content, initial_attributes_passed_to_form_content, view, initial_attributes;

    before(function() {
      initial_attributes = {
        foo: "bar",
        baz: "bop"
      }

      template = Disco.inherit(Disco.Form, {
        form_content: function(builder, initial_attributes) {
          builder_passed_to_form_content = builder;
          initial_attributes_passed_to_form_content = initial_attributes;
        }
      })

      view = Disco.build(template, initial_attributes);
    });

    it("extends the builder passed to #form_content with the FormHelper", function() {
      expect(builder_passed_to_form_content.form_for).to(equal, Disco.FormHelper.form_for);
    });

    it("forwards the initial_attributes to #form_content", function() {
      expect(initial_attributes_passed_to_form_content).to(equal, initial_attributes);
    });
  });
});