MktoForms2.loadForm('https://get.oreilly.com', '107-FMS-070', 1900);
MktoForms2.loadForm('https://get.oreilly.com', '107-FMS-070', 2023);

MktoForms2.whenReady(function(form) {
  //get the jQuery wrapped form element from Marketo
  var formElement = form.getFormElem();

  //If sales request text field exists
  if (formElement.find('input[name=Sales_Request_Context__c]').length > 0) {
    salesContext =  window.location.host + window.location.pathname;
    form.setValues({
      'Sales_Request_Context__c' : salesContext,
    });
  }

  //Enterprise Short Form
  if (formElement.attr('id') === 'mktoForm_1900' || formElement.attr('id') === 'mktoForm_2023') {
    //Find progressive feilds at end of form and move them after Email
    var progressiveMoveTarget = formElement.find('input#Email').closest('.mktoFormRow');

    //Append fields after Email in reverse display order
    var progressiveJobTitle = formElement.find('input#Title');
    if (progressiveJobTitle.length > 0) {
      progressiveMoveTarget.after(progressiveJobTitle.closest('.mktoFormRow'));
    }
    var progressiveCompany = formElement.find('input#Company');
    if (progressiveCompany.length > 0) {
      progressiveMoveTarget.after(progressiveCompany.closest('.mktoFormRow'));
    }

    form.onValidate(function(isValid) {
      if (isValid) {
        var consentSystem = "Marketo";
        var consentContext =  "demo request at " + window.location.host + window.location.pathname;

        if (formElement.find('input[name=marketing_consent]').length > 0) {
          form.setValues({
            'marketing_consent_context' : consentContext,
            'marketing_consent_system' : consentSystem
          });
        }
        else {
          form.setValues({
            'marketing_consent_context' : '',
            'marketing_consent_system' : ''
          });
        }
        
        //Block
        var firstName = formElement.find('input[name=FirstName]').val();
        if (firstName.indexOf('emc890.com') >= 0) {
          form.submittable(false);
          document.getElementById('mktoDemoFormShort').scrollIntoView(true);
          formElement.parent().siblings('.mktoDemoForm-thankyou').removeClass('hidden');
          formElement.parent().remove();
        }
      }
    });

    form.onSuccess(function(f) {
      var locale = formElement.attr('data-locale');
      if (locale === undefined) {
        locale = "";
      }

      //Push dataLayer event for Goggle Analytics
      window.dataLayer.push({
        'event': 'lead_gen_submitted_request_demo',
        'request_source': 'send request ' + locale
      });

      formElement.parent().remove();
      document.getElementById('mktoDemoFormShort-thankyou').classList.remove('hidden');
      document.getElementById('maincontent').scrollIntoView(true);
      
      return false;
    });
  }
});