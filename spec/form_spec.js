Screw.Unit(function() {
  describe("Form", function() {
    var view, model, element;

    var before_helper = function(selector, fn) {
      before(function() {
        template = Disco.inherit(Disco.Form, {
          form_content: function(builder, initial_attributes) {
            with(builder) {
              fn(builder);
            }
          }
        });

        model = { name: 'Dumbo' };
        view = Disco.build(template);
        view.model = model;
        element = view.find(selector);
      });
    };
    
    describe("#input_for", function() {
      describe("when #load is called on the view", function() {
        describe("when passed a model attribute name", function() {
          before_helper('input#model_name', function(builder) {
            with(builder) {
              input_for('name');
            }
          });

          describe("the emitted input tag", function() {
            it("populates input elements in the form based on attribute values in the #model", function() {
              expect(element.length).to(equal, 1);
              expect(element.val()).to(equal, "");
              view.load();
              expect(element.val()).to(equal, 'Dumbo');
            });

            it("has @id composed of model name and attribute name", function() {
              expect(element.attr('id')).to(equal, 'model_name');
            });

            it("has @name composed of model name and attribute name", function() {
              expect(element.attr('name')).to(equal, 'model[name]');
            });

            it("has @type defaulted to 'text", function() {
              expect(element.attr('type')).to(equal, 'text');
            });

            describe("when the model does not have a value for the attribute", function() {
              before_helper('input#model_mood', function(builder) {
                with(builder) {
                  input_for('mood');
                }
              });

              it("has @value of empty string", function() {
                expect(element.val()).to(equal, "");
                view.load();
                expect(element.val()).to(equal, "");
              });
            });
          });
        });

        describe("when passed a model attribute name and html_attributes", function() {
          before_helper('input#model_name', function(builder) {
            with(builder) {
              input_for('name', { 'type': 'hidden', 'class': 'custom_class' });
            }
          });
          
          describe("the emitted input tag", function() {
            it("includes the given html_attributes", function() {
              expect(element.attr('type')).to(equal, 'hidden');
              expect(element.attr('class')).to(equal, 'custom_class');
            });
          });
        });
      });
      
      describe("when #save is called on the view", function() {
        before_helper('input#model_name', function(builder) {
          with(builder) {
            input_for('name');
          }
        });

        it("stores input element values in the view's #model", function() {
          var new_model_name = "Elephant";
          element.val(new_model_name);
          expect(model.name).to(equal, "Dumbo");
          view.save();
          expect(model.name).to(equal, new_model_name);
        });
      });
    });
    
    describe("#select_for", function() {
      describe("when #load is called on the view", function() {
        describe("when passed a model attribute name", function() {
          before_helper('select#model_type', function(builder) { 
            with(builder) {
              select_for('type');
            }
          });

          describe("the emitted select tag", function() {
            it("has @id composed of model name and attribute name", function() {
              expect(element.length).to(equal, 1);
              expect(element.attr('id')).to(equal, 'model_type');
            });

            it("has @name composed of model name and attribute name", function() {
              expect(element.length).to(equal, 1);
              expect(element.attr('name')).to(equal, 'model[type]');
            });
          });
        });

        describe("when passed a model attribute name and a function", function() {
          before_helper('select#model_type', function(builder) { 
            with(builder) {
              select_for('type', function() {
                option('Elephant');
                option('Donkey');
              });
            }
          });

          describe("the emitted select tag", function() {
            it("invokes the function to generate option elements", function() {
              expect(element.find('option').length).to(equal, 2);
            });
          });
        });

        describe("when passed a model attribute name and html_attributes", function() {
          before_helper('select#model_type', function(builder) { 
            with(builder) {
              select_for('type', {'class': 'custom_class'});
            }
          });

          describe("the emitted select tag", function() {
            it("includes the given html_attributes", function() {
              expect(element.attr('class')).to(equal, 'custom_class');
            });
          });
        });

        describe("when passed a model attribute name, html_attributes and a function", function() {
          before_helper('select#model_type', function(builder) { 
            with(builder) {
              select_for('type', {'class': 'custom_class'}, function() {
                option('Elephant');
              });
            }
          });

          describe("the emitted select tag", function() {
            it("includes the given html_attributes and invokes the function to generate option elements", function() {
              expect(element.attr('class')).to(equal, 'custom_class');
              expect(element.find('option').length).to(equal, 1);
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