define(['amd/okay'], function(okay) {
  describe('Okay.IsNumeric', function() {

    var Default = okay.Define({test: okay.IsNumeric()});

    it('should give error when field is not a number', function() {
      var target = new Default({test: 'A'});
      expect(target.test.error).toEqual("IsNumeric");
      expect(target.test.message).toEqual("is not a numeric value");
    });

    it ('should not give error when field is a number', function() {
      var target = new Default({test: 42});
      expect(target.test).not.toBeDefined();
    });
  });
});
