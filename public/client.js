
var constant = {
  endpoint: 'https://confederation-id.me:8443/id/auth'
};


var $status = document.getElementById('status');
var $loginForm = document.getElementById('loginForm');
var $challengeForm = document.getElementById('challengeForm');
var $email = document.getElementById('email');
var $secret = document.getElementById('secret');
var $reset =  document.getElementById('reset');

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
      , error: function(err){
        setStatus('No response');
        console.log('err',err);
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
    
    var r = reqwest({
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
         global.token = r.request.getResponseHeader('Authentication');
         localStorage.setItem('Authentication', global.token);
         localStorage.setItem('identifier', global.identifier);

        }
      , error: function(err){
        setStatus('No secret response');
        console.log('err secret',err);
      }
    });//.then(function(resp){
    //  console.log('resp',resp,r);
    //  console.log('Authentication', r.request.getResponseHeader('Authentication'));
    //}).fail(function (err, msg) {
    //  debugger;
    //})
    //.always(function (resp) {
    //  console.log('always', resp);
    //});
  }
};

function checkStatus(){
  var token = localStorage.getItem('Authentication');
  var identifier = localStorage.getItem('identifier');
  if (token && identifier){
    reqwest({
        url: constant.endpoint
      , type: 'json'
      , contentType: 'application/json'
      , crossOrigin: true        
      , method: 'get'
      , headers: {
        'Authentication': token
      }
      , data: {identifier: identifier}
      , success: function (resp) {
         console.log('Success', resp);
         setStatus('Signed in');
        }
      , error: function(err){
        setStatus('Not signed in');
        console.log('err',err);
      }
    });
  }
}

checkStatus();

$reset.onclick = function(event){
  global = {};
  go2step(1);
};
  
  