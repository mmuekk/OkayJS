define(['amd/okay'], function(okay) {
  describe('Okay.Custom', function() {

    function custom(value) {
      return value === 'Pass';
    }

    var Default = okay.defineWrapper({test: okay.Custom(custom)});

    it('should give error when custom function returns false', function() {
      var target = new Default({test: 'Fail'});
      expect(target.test.error).toEqual("Custom");
      expect(target.test.message).toEqual("is not a valid value");
    });

    it ('should not give error when field has value', function() {
      var target = new Default({test: 'Pass'});
      expect(target.test).not.toBeDefined();
    });
  });
});
