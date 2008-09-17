Disco.Form = {
  content: function(builder, initial_attributes) {
    var self = this;
    with(builder) {
      form(function() {
        self.form_content(new Disco.Form.Builder(builder, self.configuration), initial_attributes);
      });
    }
  },
  
  methods: {
    after_initialize: function() {
      if(this.model) {
        this.load();
      }
    },
    
    load: function() {
      var self = this;
      if(this.form_fields) {
        $.each(this.form_fields, function(i, form_field) {
          form_field.load(self.model);
        });
      }
      
      if(this.message_lists) {
        $.each(this.message_lists, function(i, message_list) {
          message_list.load(self.model);
        });
      }
    },
    
    save: function() {
      if (this.before_save) {
        this.before_save();
      }

      if (this.form_fields) {
        var self = this;
        $.each(this.form_fields, function(i, form_field) {
          form_field.save(self.model);
        });
      }
      
      if(this.message_lists) {
        $.each(this.message_lists, function(i, message_list) {
          message_list.save(self.model);
        });
      }

      if (this.after_save) {
        this.after_save();
      }
    }
  }
}

Disco.Form.Builder = function(builder, configuration) {
  this.doc = builder.doc;
  this.configuration = configuration;
}

$.extend(Disco.Form.Builder.prototype, new Disco());
$.extend(Disco.Form.Builder.prototype, {
  messages_for: function() {
    var attribute = arguments[0];
    var html_attributes = {
      'id': this.id_for_attribute(attribute),
      'class': 'messages ' + attribute,
      'style': 'display: none;'
    };
    
    this.doc.push(new Disco.PostProcessorInstruction('register_message_list', [attribute]));
    this.ul(html_attributes);
  },
  
  label_for: function() {
    var attribute = arguments[0];
    var titleized = attribute.titleize();
    var html_attributes = {
      'for': this.id_for_attribute(attribute)
    };
    
    if(arguments.length == 2) {
      $.extend(html_attributes, arguments[1]);
    }
    
    this.label(titleized, html_attributes);
  },
  
  input_for: function() {
    var attribute = arguments[0];
    var html_attributes = {
      'id': this.id_for_attribute(attribute),
      'name': this.name_for_attribute(attribute),
      'type': 'text',
      'value': ''
    }
    if(arguments.length == 2) {
      $.extend(html_attributes, arguments[1]);
    }

    this.doc.push(new Disco.PostProcessorInstruction('register_form_field', [attribute]));
    this.input(html_attributes);
  },
  
  select_for: function() {
    var attribute = arguments[0];
    var html_attributes = {
      'id': this.id_for_attribute(attribute),
      'name': this.name_for_attribute(attribute)
    };
    var array_args = [html_attributes];
    var hash_or_fn = arguments[1];
    var fn = arguments[2];

    if(!fn) {
      if (typeof hash_or_fn == 'function') {
        array_args.push(hash_or_fn);
      } else if (typeof hash_or_fn == 'object') {
        $.extend(html_attributes, hash_or_fn);
      }
    } else {
      $.extend(array_args[0], hash_or_fn);
      array_args.push(fn);
    }

    this.doc.push(new Disco.PostProcessorInstruction('register_form_field', [attribute]));
    this.tag_with_array_args('select', array_args);
  },
  
  action_button: function() {
    var text = arguments[0];
    var action_name = arguments[1];

    var html_attributes = {
      'id': this.prefix() + '_button_' + action_name,
      'name': this.prefix() + '[button][' + action_name + ']',
      'type': 'button',
      'value': text
    };
    
    if (arguments.length == 3) {
      $.extend(html_attributes, arguments[2]);
    }
    
    this.input(html_attributes).click(function(event, view) { 
      view[action_name].call(view);
    });
  },

  prefix: function() {
    if (!this.__prefix__) {
      if(this.configuration && this.configuration.constructor_name) {
        this.__prefix__ = this.configuration.constructor_name.toLowerCase();
      }
      else {
        this.__prefix__ = 'model';
      }
    }
    
    return this.__prefix__;
  },

  id_for_attribute: function(attribute) {
    return this.prefix() + "_" + attribute;
  },
  
  name_for_attribute: function(attribute) {
    return this.prefix() + "[" + attribute + "]";
  }
});

$.extend(Disco.PostProcessor.prototype, {
  register_form_field: function(attribute) {
    var form_field = this.next_element();
    var current_view = this.current_view();
    if (!current_view.form_fields) current_view.form_fields = [];
    current_view.form_fields.push(new Disco.Form.FieldDefinition(attribute, form_field, current_view));
  },
  
  register_message_list: function(attribute) {
    var message_list = this.next_element();
    var current_view = this.current_view();
    if (!current_view.message_lists) current_view.message_lists = [];
    current_view.message_lists.push(new Disco.Form.MessageListDefinition(attribute, message_list, current_view));
  }
});

Disco.Form.FieldDefinition = function(attribute, form_field, current_view) {
  this.attribute = attribute;
  this.form_field = form_field;
  this.current_view = current_view;
};

$.extend(Disco.Form.FieldDefinition.prototype, {
  load: function(model) {
    var value = model[this.attribute] || '';
    this.form_field.val(value);
  },
  
  save: function(model) {
    model[this.attribute] = this.form_field.val();
  }
});

Disco.Form.MessageListDefinition = function(attribute, message_list, current_view) {
  this.attribute = attribute;
  this.message_list = message_list;
  this.current_view = current_view;
};

$.extend(Disco.Form.MessageListDefinition.prototype, {
  load: function(model) {
    if(model[this.attribute]) {
      var self = this;
      var message_attribute = model[this.attribute];
      var message_class = self.attribute.singularize();
      
      this.current_view.addClass(message_class);
      this.message_list.show();
      
      var cloned_message_attribute = {};
      $.each(message_attribute, function(key, value) {
        cloned_message_attribute[key] = value;
      });

      $.each(this.current_view.form_fields, function(i, field) {
        var field_attribute = field.attribute;
        if(message_attribute[field_attribute]) {
          self.message_list.append(Disco.build(function(builder) {
            builder.li(field_attribute.titleize() + ' ' + message_attribute[field_attribute]);
          }));
          
          field.form_field.addClass(message_class);
          
          delete cloned_message_attribute[field_attribute];
        }
      });

      $.each(cloned_message_attribute, function(key, value) {
        self.message_list.append(Disco.build(function(builder) {
          builder.li(key.titleize() + ' ' + value);
        }));
      });
    }
  },
  
  save: function(model) {
    var self = this;
    var message_class = self.attribute.singularize();
    
    this.current_view.removeClass(message_class);
    this.message_list.hide();
    this.message_list.empty();

    $.each(this.current_view.form_fields, function(i, field) {
      field.form_field.removeClass(message_class);
    });
    
    delete model[this.attribute];
  }
});
