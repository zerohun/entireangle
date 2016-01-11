Template.addressForm.helpers({
  optsGoogleplace: function() {
    return {}
  },
  formSchema: function(){
    return new SimpleSchema({
      address: {
        type: AddressSchema,
        label: 'address'
      }
    });
  }
});
