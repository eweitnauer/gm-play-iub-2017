// Called when the user chooses a google account from the pop-up.
loginCallBack = function() {
    queryUserData(function(error, data) {
        if (!error) {
            window.gm_logged_in = true;
        }
        else{
            window.gm_logged_in = false;
        }
    });
}

function isLoggedIn() {
  return window.gm_logged_in;
}

function queryUserData(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://graspablemath.com/api/user');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (callback && xhr.readyState == 4) {
      if (xhr.status == 200) callback(null, JSON.parse(xhr.responseText));
      else callback({status: xhr.status, response: xhr.responseText});
    }
  };
  xhr.send();
}

// Write user data to the server. Will only affect the data fields that are passed,
// keeping other fields at their current value on the server. The callback is called
// with an error object or null as the first argument.
function setGameData(data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://graspablemath.com/api/save_the_baby_dinos');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
    if (callback && xhr.readyState == 4) {
      if (xhr.status == 200) callback(null, data);
      else callback({status: xhr.status, response: xhr.responseText});
    }
  };
  xhr.send(JSON.stringify(data));
}

// Gets game user data. Will call callback with (error, data). Error will be null
// if everything went fine.
function getGameData(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://graspablemath.com/api/save_the_baby_dinos');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (callback && xhr.readyState == 4) {
      if (xhr.status == 200) callback(null, JSON.parse(xhr.responseText));
      else callback({status: xhr.status, response: xhr.responseText});
    }
  };
  xhr.send();
}

function set_data(points,level_1_stars) {
    if (!isLoggedIn()) {
        //console.log('user is not logged in!');
        return;
    }
    setGameData({points,level_1_stars}, function(error) {
        if (error) console.log(JSON.stringify(error));
        //else console.log('successfully sent data to database!');
    });
}

function get_data() {
  if (!isLoggedIn()) {
    //console.log('user is not logged in!');
    return;
  }
  getGameData(function(error, data) {
    if (error) {
        //console.log(JSON.stringify(error));
        return false;
    }
    else{
        var jsonstringdata = JSON.stringify(data);
        window.localStorage.setItem('LoggedInUserProgress', jsonstringdata);
    }
  });
}