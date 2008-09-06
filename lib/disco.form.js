Disco.Form = {
  content: function(builder, initial_attributes) {
    var self = this;
    with(builder) {
      form(function() {
        self.form_content(new Disco.Form.Builder(builder), initial_attributes);
      });
    }
  },
  
  methods: {
    load: function() {
      var self = this;
      $.each(this.form_fields, function(i, form_field) {
        form_field.load(self.model);
      });
    },
    
    save: function() {
      var self = this;
      $.each(this.form_fields, function(i, form_field) {
        form_field.save(self.model);
      });
    }
  }
}

Disco.Form.Builder = function(builder) {
  this.doc = builder.doc;
}

$.extend(Disco.Form.Builder.prototype, new Disco());
$.extend(Disco.Form.Builder.prototype, {
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
  
  id_for_attribute: function(attribute) {
    return "model_" + attribute;
  },
  
  name_for_attribute: function(attribute) {
    return "model[" + attribute + "]";
  }
});

$.extend(Disco.PostProcessor.prototype, {
  register_form_field: function(attribute) {
    var form_field = this.next_element();
    var current_view = this.current_view();
    if (!current_view.form_fields) current_view.form_fields = [];
    current_view.form_fields.push(new Disco.Form.FieldDefinition(attribute, form_field));
  }
});

Disco.Form.FieldDefinition = function(attribute, form_field) {
  this.attribute = attribute;
  this.form_field = form_field;
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
