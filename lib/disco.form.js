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
  input_for: function(attribute) {
    this.doc.push(new Disco.PostProcessorInstruction('register_form_field', [attribute]));
    this.input({id: "model_" + attribute});
  },
  
  select_for: function() {
    var attribute = arguments[0];
    var html_attributes = {
      'id': "model_" + attribute,
      'name': "model[" + attribute + "]"
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
  
  //   select_for: function() {
  //     var attribute = arguments[0];
  //     var html_attributes = {
  //       'id': this.field_id(attribute),
  //       'name': this.field_name(attribute)
  //     };
  //     var array_args = [html_attributes];
  // 
  //     if(arguments.length == 2) {
  //       var arg1 = arguments[1];
  //       if(typeof arg1 == 'function') {
  //         array_args.push(arg1);
  //       }
  //       else if(typeof arg1 == 'object') {
  //         $.extend(html_attributes, arg1);
  //       }
  //     }
  //     else if(arguments.length == 3) {
  //     }
  // 
  //     return this.tag_with_array_args('select', array_args);
  //   },

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
    this.form_field.val(model[this.attribute]);
  },
  
  save: function(model) {
    model[this.attribute] = this.form_field.val();
  }
});

// Disco.FormHelper = {
//   form_for: function() {
//     if(arguments.length > 3) {
//       throw "FormHelper#form_for does not take more than 3 arguments";
//     }
// 
//     this.form_object = arguments[0];
//     var id_class = this.form_class();
//     var html_attributes = {
//       'action': Disco.UrlHelper[this.object_name() + 's_path'](this.form_object),
//       'method': this.form_method(),
//       'id': id_class,
//       'class': id_class
//     };
//     var array_args = [html_attributes];
// 
//     if(arguments.length == 2) {
//       var arg1 = arguments[1];
//       if(typeof arg1 == 'object') {
//         $.extend(html_attributes, arg1);
//       }
//       else if(typeof arg1 == 'function') {
//         array_args.push(arg1);
//       }
//       else {
//         throw "FormHelper#form_for invalid argument: " + arg1;
//       }
//     }
//     else if(arguments.length == 3) {
//       $.extend(html_attributes, arguments[1]);
//       array_args.push(arguments[2]);
//     }
// 
//     return this.tag_with_array_args('form', array_args);
//   },
// 
//   label_for: function() {
//     var attribute = arguments[0];
//     var titleized = attribute.titleize();
//     var html_attributes = {
//       'for': this.field_id(attribute)
//     };
//     var array_args = [titleized, html_attributes];
// 
//     if(arguments.length == 2) {
//       var arg1 = arguments[1];
//       if(typeof arg1 == 'function') {
//         array_args = [arg1];
//       }
//       else if(typeof arg1 == 'object') {
//         $.extend(html_attributes, arg1);
//       }
//       else if(typeof arg1 == 'string') {
//         array_args[0] = arg1;
//       }
//     }
//     else if(arguments.length == 3) {
//       var arg1 = arguments[1];
//       if(typeof arg1 == 'string') {
//         array_args[0] = arg1;
//         $.extend(html_attributes, arguments[2]);
//       }
//       else {
//         array_args[0] = $.extend(html_attributes, arg1);
//         array_args[1] = arguments[2];
//       }
//     }
// 
//     return this.tag_with_array_args('label', array_args);
//   },
// 
//   input_for: function() {
//     var attribute = arguments[0];
//     var html_attributes = {
//       'id': this.field_id(attribute),
//       'name': this.field_name(attribute),
//       'type': 'text',
//       'value': this.form_object[attribute] || ''
//     };
//     var array_args = [html_attributes];
// 
//     if(arguments.length == 2) {
//       $.extend(html_attributes, arguments[1]);
//     }
// 
//     return this.tag_with_array_args('input', array_args);
//   },
// 
// 
//   option_for: function(attribute, text, html_attributes) {
//     if(this.form_object[attribute] == html_attributes.value) {
//       html_attributes.selected = 'selected';
//     }
//     this.option(text, html_attributes);
//   },
// 
//   object_name: function() {
//     return this.form_object.constructor.name.toLowerCase();
//   },
// 
//   form_method: function() {
//     return this.form_object.id ? 'put' : 'post';
//   },
// 
//   form_class: function() {
//     return (this.form_object.id ? 'edit_' : 'new_') + this.object_name();
//   },
// 
//   field_id: function(attribute) {
//     return this.object_name() + '_' + attribute.toLowerCase();
//   },
// 
//   field_name: function(attribute) {
//     return this.object_name() + '[' + attribute.toLowerCase() + ']';
//   }
// }