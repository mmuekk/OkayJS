var tests = Object.keys(window.__karma__.files).filter(function (s) { return /Spec\.js/.test(s);});

window.requirejs.config({
  baseUrl: '/base',
  deps: tests,
  callback: function() {
    window.__karma__.start();
  }
});