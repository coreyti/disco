Screw.Unit(function() {
  describe("FormHelper", function() {
    var view, model, the_builder, orig_url_helper;
    var HTTP_METHODS = {
      'index':   'get',
      'show':    'get',
      'new':     'get',
      'create':  'post',
      'edit':    'get',
      'update':  'put',
      'destroy': 'post'
    }
    
    before(function() {
      orig_url_helper = Disco.UrlHelper;
      Disco.UrlHelper = {
        models_path: function(model) {
          if(model && model.id) {
            return '/models/' + model.id;
          }
          return '/models';
        }
      };
    });
    
    after(function() {
      Disco.UrlHelper = orig_url_helper;
    });
    
    describe("when used to extend a Disco builder", function() {
      before(function() {
        view = Disco.build(function(builder) {
          $.extend(builder, Disco.FormHelper);
          the_builder = builder;

          builder.p('content');
        });
      });

      it("decorates the builder with the Disco.FormHelper functions", function() {
        expect(typeof the_builder.form_for).to(equal, 'function');
        expect(typeof the_builder.label_for).to(equal, 'function');
        expect(typeof the_builder.input_for).to(equal, 'function');
        expect(typeof the_builder.select_for).to(equal, 'function');
        expect(typeof the_builder.option_for).to(equal, 'function');
      });
    });
    
    describe("#form_for", function() {
      var form;

      describe("when passed a model object as its single argument", function() {
        before(function() {
          template = {
            content: function(builder, initial_attributes) {
              $.extend(builder, Disco.FormHelper);
              the_builder = builder;

              with(builder) {
                div(function() {
                  form_for(initial_attributes.model);
                });
              }
            }
          };
        });

        it("sets #form_object on the builder", function() {
          model = this.build_example_model();
          view = Disco.build(template, { model: model });
          expect(the_builder.form_object).to(equal, model);
        });
        
        describe("when passed a model object with no #id", function() {
          describe("the emitted form tag", function() {
            before(function() {
              model = this.build_example_model();
              view = Disco.build(template, { model: model });
              form = view.find('form');
            });

            it("has @action for creating an new model instance", function() {
              expect(form.attr('action')).to(equal, '/models');
            });

            it("has @method for creating an new model instance", function() {
              expect(form.attr('method')).to(equal, HTTP_METHODS.create);
            });

            it("has @id to match the model and leading action", function() {
              expect(form.attr('id')).to(equal, 'new_model');
            });

            it("has @class to match the model and leading action", function() {
              expect(form.attr('class')).to(equal, 'new_model');
            });
          });
        });

        describe("when passed a model object with an #id", function() {
          describe("the emitted form tag", function() {
            before(function() {
              model = this.build_example_model({id: 1});
              view = Disco.build(template, { model: model });
              form = view.find('form');
            });

            it("has @action for updating the existing model object", function() {
              expect(form.attr('action')).to(equal, '/models/1');
            });

            it("has @method for updating the existing model object", function() {
              expect(form.attr('method')).to(equal, HTTP_METHODS.update);
            });

            it("has @id to match the model and leading action", function() {
              expect(form.attr('id')).to(equal, 'edit_model');
            });

            it("has @class to match the model and leading action", function() {
              expect(form.attr('class')).to(equal, 'edit_model');
            });
          });
        });
      });
      
      describe("when passed a model object and an additional argument", function() {
        describe("when the second argument is a hash of html attributes", function() {
          before(function() {
            model = this.build_example_model();
            view = Disco.build(function(builder) {
              $.extend(builder, Disco.FormHelper);

              with(builder) {
                div(function() {
                  form_for(model, { id: 'custom_id', onsubmit: 'check();' });
                });
              }
            });
            form = view.find('form');
          });

          it("sets the html attributes as attributes on the form element", function() {
            expect(form.attr('id')).to(equal, 'custom_id');
            expect(form.attr('onsubmit')).to(equal, 'check();');
          });
        });
        
        describe("when the second argument is a function", function() {
          before(function() {
            model = this.build_example_model();
            view = Disco.build(function(builder) {
              $.extend(builder, Disco.FormHelper);

              with(builder) {
                div(function() {
                  form_for(model, function() {
                    p({'class': 'fn_called'});
                  });
                });
              }
            });
          });

          it("invokes the function to generate the body of the form", function() {
            expect(view.find('form p.fn_called').length).to(equal, 1);
          });
        });
        
        describe("when the second argument is neither a hash nor a function", function() {
          it("throws an exception", function() {
            var exception;
            try {
              model = this.build_example_model();
              Disco.build(function(builder) {
                $.extend(builder, Disco.FormHelper);

                with(builder) {
                  div(function() {
                    form_for(model, 'a string');
                  });
                }
              });
            }
            catch(e) {
              exception = e;
            }
            
            expect(exception).to_not(equal, undefined);
          });
        });
      });
      
      describe("when passed a model object, html_attributes, and a function", function() {
        before(function() {
          model = this.build_example_model();
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, { id: 'custom_id', onsubmit: 'check();' }, function() {
                  p({'class': 'fn_called'});
                });
              });
            }
          });
        });

        it("extends the html attributes passed to the form element with the given html_attributes", function() {
          var form = view.find('form');
          expect(form.attr('id')).to(equal, 'custom_id');
          expect(form.attr('onsubmit')).to(equal, 'check();');
        });

        it("invokes the function to generate the body of the form", function() {
          expect(view.find('form p.fn_called').length).to(equal, 1);
        });
      });
      
      describe("when passed more than 3 arguments", function() {
        it("throws an exception", function() {
          var exception;
          try {
            model = this.build_example_model();
            Disco.build(function(builder) {
              $.extend(builder, Disco.FormHelper);

              with(builder) {
                div(function() {
                  form_for(model, 2, 3, 4);
                });
              }
            });
          }
          catch(e) {
            exception = e;
          }
          
          expect(exception).to_not(equal, undefined);
        });
      });
    });
    
    describe("#label_for", function() {
      var label, input;
      
      describe("when passed a model attribute name", function() {
        before(function() {
          model = this.build_example_model({full_name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  label_for('full_name');
                  input_for('full_name');
                });
              });
            }
          });
          label = view.find('form label');
          input = view.find('form input');
        });
        
        describe("the emitted label tag", function() {
          it("has @for composed of model name and attribute name and matching the @id of the input tag", function() {
            expect(label.attr('for')).to(equal, 'model_full_name');
            expect(label.attr('for')).to(equal, input.attr('id'));
          });
          
          it("has a titlecase form of model#attribute as its text", function() {
            expect(label.html()).to(equal, 'Full Name');
          });
        });
      });

      describe("when passed a model attribute name and html_attributes", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  label_for('name', {'class': 'custom_class'});
                });
              });
            }
          });
          label = view.find('form label');
          input = view.find('form input');
        });

        describe("the emitted label tag", function() {
          it("includes the given html_attributes", function() {
            expect(label.attr('class')).to(equal, 'custom_class');
          });
        });
      });
      
      describe("when passed a model attribute name and a function", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  label_for('name', function() {
                    span({'class': 'fn_called'});
                  });
                });
              });
            }
          });
          label = view.find('form label');
          input = view.find('form input');
        });

        describe("the emitted label tag", function() {
          it("invokes the function to generate the body of the label", function() {
            expect(label.find('span.fn_called').length).to(equal, 1);
          });
        });
      });

      describe("when passed a model attribute name, a string of content, and html_attributes", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  label_for('name', 'cUstom lAbel', {'class': 'custom_class'});
                });
              });
            }
          });
          label = view.find('form label');
          input = view.find('form input');
        });

        describe("the emitted label tag", function() {
          it("has the passed in content as its text", function() {
            expect(label.html()).to(equal, 'cUstom lAbel');
          });

          it("includes the given html_attributes", function() {
            expect(label.attr('class')).to(equal, 'custom_class');
          });
        });
      });

      describe("when passed a model attribute name, html_attributes, and a function", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  label_for('name', {'class': 'custom_class'}, function() {
                    span({'class': 'fn_called'});
                  });
                });
              });
            }
          });
          label = view.find('form label');
          input = view.find('form input');
        });

        describe("the emitted label tag", function() {
          it("invokes the function to generate the body of the label", function() {
            expect(label.find('span.fn_called').length).to(equal, 1);
          });

          it("includes the given html_attributes", function() {
            expect(label.attr('class')).to(equal, 'custom_class');
          });
        });
      });
    });
    
    describe("#input_for", function() {
      describe("when passed a model attribute name", function() {
        var input1, input2;
        
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  input_for('name');
                  input_for('mood');
                });
              });
            }
          });
          input1 = view.find('form input#model_name');
          input2 = view.find('form input#model_mood');
        });
        
        describe("the emitted input tag", function() {
          it("has @id composed of model name and attribute name", function() {
            expect(input1.attr('id')).to(equal, 'model_name');
          });

          it("has @name composed of model name and attribute name", function() {
            expect(input1.attr('name')).to(equal, 'model[name]');
          });

          it("has @type defaulted to 'text", function() {
            expect(input1.attr('type')).to(equal, 'text');
          });

          describe("when the model has a value for the attribute", function() {
            it("has @value equal to the model#attribute value", function() {
              expect(input1.attr('value')).to(equal, model.name);
            });
          });

          describe("when the model does not have a value for the attribute", function() {
            it("has @value of empty string", function() {
              expect(input2.attr('value')).to(equal, '');
            });
          });
        });
      });
      
      describe("when passed an attribute name and a hash of html attributes", function() {
        var input;
        
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  input_for('name', {'id': 'custom_id', 'class': 'custom_class'});
                });
              });
            }
          });
          input = view.find('form input');
        });
        
        describe("the emitted input tag", function() {
          it("includes attributes matching those passed in", function() {
            expect(input.attr('name')).to(equal, 'model[name]');
            expect(input.attr('id')).to(equal, 'custom_id');
            expect(input.attr('class')).to(equal, 'custom_class');
          });
        });
      });
    });

    // NOTE:
    // For multi-choice items (e.g., radios and selects),
    // need to account for model attribute values as arrays.
    
    describe("#select_for", function() {
      var select;
      
      describe("when passed a model attribute name", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);
            the_builder = builder;

            with(builder) {
              div(function() {
                form_for(model, function() {
                  select_for('name');
                });
              });
            }
          });
          select = view.find('form select#model_name');
        });
        
        describe("the emitted select tag", function() {
          it("has @id composed of model name and attribute name", function() {
            expect(select.attr('id')).to(equal, 'model_name');
          });

          it("has @name composed of model name and attribute name", function() {
            expect(select.attr('name')).to(equal, 'model[name]');
          });
        });
      });

      describe("when passed a model attribute name and html_attributes", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);
            the_builder = builder;

            with(builder) {
              div(function() {
                form_for(model, function() {
                  select_for('name', {'class': 'custom_class'});
                });
              });
            }
          });
          select = view.find('form select#model_name');
        });

        describe("the emitted select tag", function() {
          it("includes the given html_attributes", function() {
            expect(select.attr('class')).to(equal, 'custom_class');
          });
        });
      });

      describe("when passed a model attribute name and a function", function() {
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);
            the_builder = builder;

            with(builder) {
              div(function() {
                form_for(model, function() {
                  select_for('name', function() {
                    option('one');
                    option('two');
                  });
                });
              });
            }
          });
          select = view.find('form select#model_name');
        });

        describe("the emitted select tag", function() {
          it("invokes the function to generate the options for the select", function() {
            expect(select.find('option').length).to(equal, 2);
          });
        });
      });

      describe("when passed a model attribute name, html_attributes, and a function", function() {
        var fn_called = false;
        
        before(function() {
          model = this.build_example_model({name: 'Lisa Fonssagrives'});
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);
            the_builder = builder;

            with(builder) {
              div(function() {
                form_for(model, function() {
                  select_for('name', {'class': 'custom_class'}, function() {
                    fn_called = true; // TODO: switch to #option
                  });
                });
              });
            }
          });
          select = view.find('form select#model_name');
        });

        describe("the emitted select tag", function() {
          it("invokes the function to generate the options for the select", function() {
            expect(fn_called).to(equal, true);
            // expect(select.find('option').length).to(equal, 1);
          });

          it("includes the given html_attributes", function() {
            expect(select.attr('class')).to(equal, 'custom_class');
          });
        });
      });
    });
    
    describe("#option_for", function() {
      var select, options, available_names;
      
      describe("when passed a model attribute name, a string of content, and html_attributes", function() {
        before(function() {
          model = this.build_example_model({group_id: 2});
          groups = {
            1: 'NSA',
            2: 'CIA',
            3: 'FBI'
          };
          
          view = Disco.build(function(builder) {
            $.extend(builder, Disco.FormHelper);

            with(builder) {
              div(function() {
                form_for(model, function() {
                  select_for('name', function() {
                    $.each(groups, function(value, name) {
                      option_for('group_id', 'Group: ' + name, { 'value': value, 'class': 'custom_class' });
                    });
                  });
                });
              });
            }
          });
          select = view.find('form select');
          options = view.find('form select option');
        });
        
        describe("the emitted option tag", function() {
          it("has text matching the string argument", function() {
            expect(options.eq(0).html()).to(equal, 'Group: NSA');
            expect(options.eq(1).html()).to(equal, 'Group: CIA');
            expect(options.eq(2).html()).to(equal, 'Group: FBI');
          });
          
          it("has @value matching the html_attributes.value", function() {
            expect(options.eq(0).attr('value')).to(equal, '1');
            expect(options.eq(1).attr('value')).to(equal, '2');
            expect(options.eq(2).attr('value')).to(equal, '3');
          });
          
          it("has @selected='selected' for the option whose @value matches the value of model[attribute]", function() {
            expect(model['group_id']).to(equal, 2);
            
            expect(options.eq(0).attr('selected')).to(equal, false);
            expect(options.eq(1).attr('selected')).to(equal, true);
            expect(options.eq(2).attr('selected')).to(equal, false);
          });
          
          it("includes the given html_attributes", function() {
            expect(options.eq(0).hasClass('custom_class')).to(equal, true);
            expect(options.eq(1).hasClass('custom_class')).to(equal, true);
            expect(options.eq(2).hasClass('custom_class')).to(equal, true);
          });
        });
      });
    });
    
    // NOTE:
    // Some options...  ;)
    //
    // * requiring builder.select_attribute be set:
    // 
    //   select_for('max_players', function() {
    //     options([2, 3, 4, 5], 'up to #{value} players');
    //   });
    //   
    //   select_for('max_players', function() {
    //     options([2, 3, 4, 5], function(value) {
    //       return 'up to #{value} player'.pluralize(value);
    //     });
    //   });
    //   
    // * additionally, that option be overriden to handle the selection:
    //     
    //   select_for('max_players', function() {
    //     $.each([2, 3, 4, 5], function(i, value) {
    //       option('up to #{value} players'.interpolate({'value', value}), { value: value });
    //     });
    //   });
    //     
    // * no requirement that builder.select_attribute be set or option overriden:
    //     
    //   select_for('max_players', function() {
    //     options_for('max_players', [2, 3, 4, 5], 'up to #{value} players');
    //   });
    //   
    //   select_for('max_players', function() {
    //     options_for('max_players', [2, 3, 4, 5], function(value) {
    //       return 'up to #{value} player'.pluralize(value);
    //     });
    //   });
    //   
    //   select_for('max_players', function() {
    //     $.each([2, 3, 4, 5], function(i, value) {
    //       option_for('max_players', 'up to #{value} players'.interpolate({'value', value}), { value: value });
    //     });
    //   });
    //     
    // * no requirement that builder.select_attribute be set or option overriden (but verbose):
    //     
    //   select_for('max_players', function() {
    //     $.each([2, 3, 4, 5], function(i, value) {
    //       option('up to #{value} players'.interpolate({'value', value}), {
    //         value: value,
    //         selected: (event.max_players == value) ? 'selected' : null
    //       });
    //     });
    //   });
    
    this.build_example_model = function(options) {
      return $.extend({constructor: {name: 'Model'}}, options || {});
    };
  });
});
