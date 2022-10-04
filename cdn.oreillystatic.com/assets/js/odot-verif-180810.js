document.addEventListener("DOMContentLoaded", function(event) {
	toggleFormThankYou() 
	enableForm();
	setRedirectUrls();
	addCountryEventListeners();
});

function toggleFormThankYou() {
	// show/hide form or thankyou message depending on URL parameters
	if (parseParams('submit') === 'true') {
		var formId = ('#' + parseParams('name'));
	  toggleHidden(formId, formId + '-thankyou');
	  history.pushState(null, "", location.href.split("?")[0]);
	  $('html, body').animate({
	    scrollTop: $(formId + '-thankyou').offset().top - 50
	  }, 500);
	}
}

function parseParams(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( window.location.href ); 
  if (results === null) return ""; 
  else return (results[1]);
}

function enableForm() {
  // enable form submit button if javascript present
  $('form input, form select, form textarea, form button').prop('disabled', false);
};

function setRedirectUrls() {
  // set values of redirect urls in forms    
	var forms = document.getElementsByClassName('salesforce-form');
	for (i = 0; i < forms.length; i++) {
		var formId = forms[i].id;
		var downloadURL = (window.location.href.split('?')[0] + '?submit=true&name=' + formId);
    $('#' + formId + ' input[name="retURL"]').val(downloadURL);
	}
}

function addCountryEventListeners() {
	var countries = document.querySelectorAll('[name="country"]');
	for (i = 0; i < countries.length; i++ ) {
    countries[i].addEventListener('change', identifyTarget, false); 
  }
};

function identifyTarget(e) {
  var country = e.target.value;
  var parentForm = e.target.closest('form');
  checkOptInStatus(country, parentForm);
}

function checkOptInStatus(country, parentForm) {
  var gdprSelect = parentForm.getElementsByClassName('gdpr-consent')[0];
  var optInHtml = '\n <fieldset role="radiogroup" aria-required="true" data-text="choice for receiving O&rsquo;Reilly email updates"> \n   <legend>I would like to receive email updates from O&rsquo;Reilly on its latest ideas, events, and&nbsp;offers: <strong class="red" aria-hidden="true">*</strong></legend> \n   <input type="radio" name="gdprConsent" value="True"><label for="gdprYes">Yes</label> \n   <input type="radio" name="gdprConsent" value="False"><label for="gdprNo">No</label> \n </fieldset>';
  if (isInEU(country) && gdprConsentHidden(gdprSelect)) {
  	toggleOptIn(gdprSelect, optInHtml);
  } else if (!isInEU(country) && !gdprConsentHidden(gdprSelect)) {
  	toggleOptIn(gdprSelect, ' ');
	}
}

function isInEU(country) {
  var euCountries = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Republic of Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom'];
  return(euCountries.indexOf(country) + 1);
}

function gdprConsentHidden(gdprSelect) {
  return gdprSelect.classList.contains('hidden') ? true : false;
}

function toggleOptIn(gdprSelect, optInHtml) {
	toggleHidden(gdprSelect);
	gdprSelect.innerHTML = optInHtml;
	checkError(gdprSelect);
}

function toggleHidden() {
  var targets = Array.prototype.slice.call(arguments);
  targets.forEach(function(target) {
    $(target).toggleClass('hidden');
  });
}

function checkError(arg) {
	if (arg.classList.contains('error')) {
		$(arg).removeClass('error');	
	}
}

function verif(formName) {
	var form = document.getElementById(formName);
	var formId = '#' + formName;
  $(formId +' .error').removeClass('error');
  $('[aria-invalid$="true"]').attr('aria-invalid','false');
  var errors = [];
	// find all elements in form that are required fields
	var requiredFields = $(formId + ' [aria-required$="true"]');
	// loop through required fields to check if they are valid
	for (i = 0; i < requiredFields.length; i++) {
		var field = requiredFields[i];
		if (fieldInvalid(field, form)) {
			createError(field, formId, formName, errors);
		};
	}
	// if errors found, display them and prevent submit
	if (errors.length > 0) {
		displayErrors(errors, formId);
		return false;
	}
	// when no errors found
	// 
	if (form.classList.contains('salesforce-form')) {
		setSalesforceFields(form, formId);
	}
	return true;
	// return false;
}

function fieldInvalid(field, form) {
	if (field.tagName === "FIELDSET") {
		return (radioInvalid(field, form)) ? true : false;
	} else if (field.name === "email") {
		return (emailInvalid(form)) ? true : false;
	}	else {
		return (field.value.length < 1) ? true : false;
	}
}

function radioInvalid(field, form) {
	var fieldsetName = field.querySelectorAll('input')[0].name;
	if (form[fieldsetName].value.length < 1) return true;
}

function emailInvalid(form) {
  var mail = new RegExp('@+','g');
	if ( (form.email.value.length < 1) || (!mail.test(form.email.value)) ) {
		return true;
	}
}

function createError(field, formId, formName, errors) {
	if (field.tagName === 'FIELDSET') {
		$(formId + ' .gdpr-consent').addClass('error');
		$(formId + ' .gdpr-consent fieldset input').addClass('error').attr('aria-invalid','true');
	} else {
    $(formId + ' [name$="' + field.name + '"]').addClass('error').attr('aria-invalid','true');
  }
  $(formId +' label[for="' + formName + '_' + field.name + '"]').addClass('error');
	errors.push(field.dataset.text);
	return errors;
}

function displayErrors(errors, formId) {
  var errorMessage = '';
  if (errors.length > 3) {
    errorMessage = '<p>Please fill out all required fields.</p>';
  }
  else {
    errorMessage = '<p>Please enter your ';
    for (i = 0; i < errors.length; i++) {
      errorMessage += errors[i];
      if (i === errors.length - 2) {
        errorMessage += ', and '
      }
      else if (i < errors.length - 1) {
        errorMessage += ', '
      }
      else {
        errorMessage += '.</p>'
      }
    }
  }
  $(formId +'-errorMessage').html(errorMessage);
  $('html, body').animate({
    scrollTop: $(formId).offset().top - 20
  }, 500);
}

function setSalesforceFields(form, formId) {
	setDateTime(formId);
	setCountry(form, formId);
	setOptIn(form, formId);
}
function setDateTime(formId) {
	var now = new Date();
	// salesforce web-to-lead form requires 'mm/dd/yyyy hh:mm' format
  var time = now.toLocaleTimeString([], { 
  	timeZone: 'UTC', 
  	hour: '2-digit', 
  	minute: '2-digit', 
  });
	var date = now.toLocaleDateString('en-US', { 
  	month: '2-digit', 
  	day: '2-digit',
  	year: 'numeric',
  });
	var dateTime = date + ' ' + time;
	$(formId + ' input[name="GDPR_Marketing_Consent_Date_Time__c"]').val(dateTime);
}
function setCountry(form, formId) {
	if (form.country) {
		var country = form.country.value;
		$(formId + ' input[name="GDPR_Country__c"]').val(country);
	}
}
function setOptIn(form, formId) {
	if (form.gdprConsent) {
		var optin = form.gdprConsent.value;
		$(formId + ' input[name="GDPR_Marketing_Consent_Opt_In__c"]').val(optin);
	}
}

