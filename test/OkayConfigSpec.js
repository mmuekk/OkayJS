define(['amd/okay'], function(okay) {
  describe('Okay.configureDefaults', function() {

    var testMsg = 'will self-destruct in 5 seconds';

    okay.configureDefaults({
      requiredMsg: testMsg
    });

    var Default = okay.defineWrapper({test: [okay.Required(), okay.IsNumeric()]});

    it('should give configured error message', function() {
      var target = new Default({});
      expect(target.test.message).toEqual(testMsg);
    });

    it ('should give default error message', function() {
      var target = new Default({test: 'Pass'});
      expect(target.test.message).toEqual('is not a numeric value');
    });

    okay.configureDefaults({
      requiredMsg: 'is required'
    });
  });

  var withConfigMsg = 'O noes!';

  describe('Okay.withConfig', function() {
    var custom = okay.withConfig({requiredMsg: withConfigMsg});
    var Custom = custom.defineWrapper({test: [custom.Required(), custom.IsNumeric()]});

    it('should give configured error message', function() {
      var target = new Custom({});
      expect(target.test.message).toEqual(withConfigMsg);
    });

    it ('should give default error message', function() {
      var target = new Custom({test: 'Pass'});
      expect(target.test.message).toEqual('is not a numeric value');
    });
  });
});
