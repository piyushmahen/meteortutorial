import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

Template.landingpage.events({
  'click #regasagent'(event, instance) {
    $("#regasagentform").toggle();
  },
  'click #reqservice'(event, instance) {
    $("#serviceform").toggle();
  },
  'click #submitagent'(event, instance) {
  	var agentname = document.getElementById('agentname').value;
  	var companyname = document.getElementById('companyname').value;
  	var agentemail = document.getElementById('agentemailaddress').value;
  	var agentpassword = document.getElementById('agentpassword').value;
  	if( agentname !=="" && companyname !=="" && agentemail !=="" && agentpassword !==""){
  		profileobj={};
  		profileobj["name"] = agentname;
  		profileobj["company"] = companyname;
  		Accounts.createUser({email: agentemail, password: agentpassword, profile: profileobj },function(err){
  			if(err){
  				alert(err.reason);
  			}
  			else{
  				alert("Successful! Welcome ");
  				if(Meteor.user().profile.company)
  				Router.go('/agent');
  				else
				Router.go('/getservice');
  			}

  		});
  	} else {
  		alert("All feilds are mandatory");
  	}
  },
  'click #loginbutton'(event, instance) {
  	var loginemail = document.getElementById('loginemail').value;
  	var loginpassword = document.getElementById('loginpassword').value;
  	if( loginemail !=="" && loginpassword !==""){
  		Meteor.loginWithPassword(loginemail, loginpassword, function(err){
  			if(err)
  				alert(err.reason);
  			else{
  				if(Meteor.user().profile.company)
  				Router.go('/agent');
  				else
				Router.go('/getservice');
  			}
  		})
  	} else {
  		alert("All feilds are mandatory");
  	}
  },
  'click #submitcustomer'(event, instance) {
  	var phonenumber = document.getElementById('identity').value;
  	if( phonenumber !==""){
  				Session.set('phonenumber',phonenumber);
				Router.go('/getservice');
  	} else {
  		alert("All feilds are mandatory");
  	}
  },	
});

Template.getservice.events({
  'click #sendcust'(event, instance) {
    var msg = document.getElementById("custinput").value;
    customer = Session.get('phonenumber');
    Communication.insert({customer:customer,msg:msg,time:Date.now()})
  }
});

Template.agent.events({
  'click #sendagent'(event, instance) {
    var msg = document.getElementById("agentinput").value;
    agent = Meteor.user().profile.name;
    Communication.insert({agent:agent,msg:msg,time:Date.now()})
  }
});


Template.registerHelper('phonenumber', function (id) {
	return Session.get('phonenumber');
});


Template.registerHelper('messagescust', function (id) {
	var customer = Session.get('phonenumber');
	data = Communication.find({},{sort:{time:-1}});
	return data;
});


Template.registerHelper('messagesagent', function (id) {
	var customer = Session.get('phonenumber');
	data = Communication.find({},{sort:{time:-1}});
	return data;
});
