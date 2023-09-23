var uid = window.localStorage.getItem('uid')
var jsonData = JSON.parse(uid)
if (window.location.href.includes('home.html') || window.location.href.includes('login.html') || window.location.href.includes('register.html')) {
  if (jsonData['type'] == 'user') {
    console.log('user');
    window.location.href = 'userHome.html'
  } else {
    console.log('psych');
    window.location.href = 'psych_home.html'
  }
}