
var constant = {
  endpoint: 'https://confederation-id.me:8443/id/auth'
};


var $status = document.getElementById('status');
var $loginForm = document.getElementById('loginForm');
var $challengeForm = document.getElementById('challengeForm');
var $email = document.getElementById('email');
var $secret = document.getElementById('secret');


function setStatus(text){
  $status.innerHTML = text;
  console.log('CF-ID>' + text);
}

function go2step(id){
  Array.prototype.slice.call(document.getElementsByClassName('step')).forEach(function(elem){
    console.log(elem);
    elem.style.display = 'none';
  });
  document.getElementById('step-' + id).style.display = 'block';
}

go2step(1);

setStatus('Initializing...');

var global = {
  identifier: '',
  challengeID: '',
  secret: ''
};

$loginForm.onsubmit=function(event){
  event.preventDefault();
  setStatus('Submit clicked..');
  var email = $email.value;
  global.identifier = email;
  if (email){
    setStatus('Posting email to auth server...');
    
    reqwest({
        url: constant.endpoint
      , type: 'json'
      , contentType: 'application/json'
      , crossOrigin: true        
      , method: 'get'
      , data: {identifier: email}
      , success: function (resp) {
         go2step(2);
         console.log('Success', resp);
         global.challengeID = resp;
         setStatus('Response available: ' + resp);
        }
    });
    
  }
};


$challengeForm.onsubmit=function(event){
  event.preventDefault();
  setStatus('Secret Form clicked');
  global.secret = ($secret.value).toUpperCase();
  if (global.secret){
    setStatus('Posting secret to auth server...');
    
    reqwest({
        url: constant.endpoint
      , type: 'json'
      , contentType: 'application/json'
      , crossOrigin: true        
      , method: 'post'
      , data: JSON.stringify(global)
      , success: function (resp) {
         console.log('Success', resp);
         global.roles = resp;
         setStatus('Secret Response available: ' + resp);
        }
    });
  }
}
  
  