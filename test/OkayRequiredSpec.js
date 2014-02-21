define(['release/okay'], function(okay) {
  describe('Okay.Required', function() {

    var Default = okay.Define({test: okay.Required()});
    var WithNullAndEmptyString = okay.Define({test: okay.Required([null, ''])});

    it('should give error when field is undefined', function() {
      var target = new Default({});
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });

    it ('should not give error when field has value', function() {
      var target = new Default({test: "Alice"});
      expect(target.test).not.toBeDefined();
    });

    it('should give error when field is null', function() {
      var target = new WithNullAndEmptyString({test: null});
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });

    it('should give error when field is empty', function() {
      var target = new WithNullAndEmptyString({test: ''});
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });
  });
});
