define(['amd/okay'], function(okay) {
  describe('Okay.Regex', function() {

    var Default = okay.defineWrapper({test: okay.Regex(/^[YN]$/)});

    it('should give error when field does not match expression', function() {
      var target = new Default({test: 'A'});
      expect(target.test.error).toEqual("Regex");
      expect(target.test.message).toEqual("is not a valid value");
    });

    it ('should not give error when field has value', function() {
      var target = new Default({test: 'Y'});
      expect(target.test).not.toBeDefined();
    });
  });
});
