define(['release/okay'], function(okay) {
  describe('Okay.IsDate', function() {

    var Default = okay.Define({test: okay.IsDate()});

    it('should give error when field is not a number', function() {
      var target = new Default({test: 'A'});
      expect(target.test.error).toEqual("IsDate");
      expect(target.test.message).toEqual("is not a date value");
    });

    it ('should not give error when field is a date', function() {
      var target = new Default({test: '2014-02-21'});
      expect(target.test).not.toBeDefined();
    });
  });
});
