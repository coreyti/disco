Screw.Unit(function() {
  describe("Disco.Form", function() {
    var view, model, element;
    
    before(function() {
      model = { name: 'Dumbo' };
    });
    
    describe("helpers", function() {
      var before_helper = function(selector, fn) {
        before(function() {
          template = Disco.inherit(Disco.Form, {
            form_content: function(builder, initial_attributes) {
              with(builder) {
                fn(builder);
              }
            },

            configuration: {
              model_type: 'Animal'
            }
          });

          view = Disco.build(template, { model: model });
          element = view.find(selector);
        });
      };

      describe("#label_for", function() {
        describe("when passed a model attribute name", function() {
          before_helper('label[for=model_name]', function(builder) {
            with(builder) {
              label_for('name');
            }
          });

          describe("the emitted label tag", function() {
            it("has @for composed of model name and attribute name", function() {
              expect(element.attr('for')).to(equal, 'model_name');
            });
          });
        });

        describe("when passed a model attribute name and html_attributes", function() {
          before_helper('label[for=model_name]', function(builder) {
            with(builder) {
              label_for('name', { 'class': 'custom_class' });
            }
          });

          describe("the emitted label tag", function() {
            it("includes the given html_attributes", function() {
              expect(element.attr('class')).to(equal, 'custom_class');
            });
          });
        });
      });

      describe("#input_for", function() {
        describe("when passed a model attribute name", function() {
          before_helper('input#model_name', function(builder) {
            with(builder) {
              input_for('name');
            }
          });

          describe("the emitted input tag", function() {
            it("has @id composed of model name and attribute name", function() {
              expect(element.attr('id')).to(equal, 'model_name');
            });

            it("has @name composed of model name and attribute name", function() {
              expect(element.attr('name')).to(equal, 'model[name]');
            });

            it("has @type defaulted to 'text", function() {
              expect(element.attr('type')).to(equal, 'text');
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

      describe("#select_for", function() {
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
    });
    
    describe("methods", function() {
      var before_helper = function(preload, selector, fn) {
        before(function() {
          template = Disco.inherit(Disco.Form, {
            form_content: function(builder, initial_attributes) {
              with(builder) {
                fn(builder);
              }
            },

            configuration: {
              model_type: 'Animal'
            }
          });

          if(preload) {
            view = Disco.build(template, { model: model });
          }
          else {
            view = Disco.build(template);
            view.model = model;
          }
          element = view.find(selector);
        });
      };

      describe("#after_initialize", function() {
        describe("when initial_attributes includes a model", function() {
          before_helper(true, 'input#model_name', function(builder) {
            with(builder) {
              input_for('name');
            }
          });
          
          it("calls #load", function() {
            expect(element.val()).to(equal, 'Dumbo');
          });
        });
        
        describe("when initial_attributes excludes a model", function() {
          before_helper(false, 'input#model_name', function(builder) {
            with(builder) {
              input_for('name');
            }
          });
          
          it("does not call #load", function() {
            expect(element.val()).to(equal, '');
            view.load();
            expect(element.val()).to(equal, 'Dumbo');
          });
        });
      });
      
      describe("#load", function() {
        describe("#input_for", function() {
          describe("when the model's attribute has a value", function() {
            before_helper(false, 'input#model_name', function(builder) {
              with(builder) {
                input_for('name');
              }
            });

            it("sets the input@value with the value of the model's attribute", function() {
              expect(element.val()).to(equal, "");
              view.load();
              expect(element.val()).to(equal, 'Dumbo');
            });
          });

          describe("when the model's attribute does not have a value", function() {
            before_helper(false, 'input#model_mood', function(builder) {
              with(builder) {
                input_for('mood');
              }
            });

            it("sets the input@value to empty string", function() {
              expect(element.val()).to(equal, "");
              view.load();
              expect(element.val()).to(equal, "");
            });
          });
        });

        describe("#select_for", function() {
          describe("when the model's attribute has a value", function() {
            before_helper(false, 'select#model_number', function(builder) { 
              with(builder) {
                select_for('number', function() {
                  option('one');
                  option('two');
                });
              }
            });

            before(function() {
              model.number = 'two'
            });

            it("selects the option matching the model's attribute value", function() {
              expect(element.val()).to(equal, 'one');
              view.load();
              expect(element.val()).to(equal, 'two');
            });
          });

          describe("when the model's attribute does not have a value", function() {
            before_helper(false, 'select#model_color', function(builder) { 
              with(builder) {
                select_for('color', function() {
                  option('red');
                  option('orange');
                  option('yellow');
                });
              }
            });

            it("selects the first option", function() {
              expect(element.val()).to(equal, 'red');
              view.load();
              expect(element.val()).to(equal, 'red');
            });
          });
        });
      });

      describe("#save", function() {
        describe("#input_for", function() {
          before_helper(false, 'input#model_name', function(builder) {
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

        describe("#select_for", function() {
          before_helper(false, 'select#model_number', function(builder) {
            with(builder) {
              select_for('number', function() {
                option('one');
                option('two');
              });
            }
          });

          before(function() {
            model.number = 'one'
          });

          it("stores the selected option in the view's #model", function() {
            var new_number = "two";
            element.val(new_number);
            expect(model.number).to(equal, "one");
            view.save();
            expect(model.number).to(equal, new_number);
          });
        });
      });
    });
  });
});