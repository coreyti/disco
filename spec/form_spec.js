Screw.Unit(function() {
  describe("Form", function() {
    var view, model;

    before(function() {
      template = Disco.inherit(Disco.Form, {
        form_content: function(builder, initial_attributes) {
          with(builder) {
            input_for('name');
            select_for('type');
          }
        }
      });

      view = Disco.build(template);
      
      model = { name: "Dumbo", type: "Elephant" };
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
    
    describe("#select_for", function() {
      describe("when #load is called on the view", function() {
        var select;

        var before_helper = function(fn) {
          before(function() {
            template = Disco.inherit(Disco.Form, {
              form_content: function(builder, initial_attributes) {
                with(builder) {
                  fn(builder);
                }
              }
            });

            view = Disco.build(template);
            view.model = model;
            select = view.find('select#model_type');
          });
        };
        
        describe("when passed a model attribute name", function() {
          before_helper(function(builder) { 
            with(builder) {
              select_for('type');
            }
          });

          describe("the emitted select tag", function() {
            it("has @id composed of model name and attribute name", function() {
              expect(select.length).to(equal, 1);
              expect(select.attr('id')).to(equal, 'model_type');
            });

            it("has @name composed of model name and attribute name", function() {
              expect(select.length).to(equal, 1);
              expect(select.attr('name')).to(equal, 'model[type]');
            });
          });
        });

        describe("when passed a model attribute name and a function", function() {
          before_helper(function(builder) { 
            with(builder) {
              select_for('type', function() {
                option('Elephant');
                option('Donkey');
              });
            }
          });

          describe("the emitted select tag", function() {
            it("invokes the function to generate option elements", function() {
              expect(select.find('option').length).to(equal, 2);
            });
          });
        });

        describe("when passed a model attribute name and html_attributes", function() {
          before_helper(function(builder) { 
            with(builder) {
              select_for('type', {'class': 'custom_class'});
            }
          });

          describe("the emitted select tag", function() {
            it("includes the given html_attributes", function() {
              expect(select.attr('class')).to(equal, 'custom_class');
            });
          });
        });

        describe("when passed a model attribute name, html_attributes and a function", function() {
          before_helper(function(builder) { 
            with(builder) {
              select_for('type', {'class': 'custom_class'}, function() {
                option('Elephant');
              });
            }
          });

          describe("the emitted select tag", function() {
            it("includes the given html_attributes and invokes the function to generate option elements", function() {
              expect(select.attr('class')).to(equal, 'custom_class');
              expect(view.find('option').length).to(equal, 1);
            });
          });
        });
      });
      
      describe("when #save is called on the view", function() {
        it("stores the selected option in the view's #model", function() {
          
        });
      });
    });
  });
});