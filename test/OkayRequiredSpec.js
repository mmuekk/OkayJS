define(['amd/okay'], function(okay) {
  describe('Okay.Required', function() {

    var Default = okay.defineWrapper({test: okay.Required()});

    it('should give error when field is undefined', function() {
      var target = new Default({});
      expect(target.any()).toBeTruthy();
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });

    it ('should not give error when field has value', function() {
      var target = new Default({test: "Alice"});
      expect(target.any()).toBeFalsy();
      expect(target.test).not.toBeDefined();
    });

    it('should give error when field is null', function() {
      var target = new Default({test: null});
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });

    it('should give error when field is empty', function() {
      var target = new Default({test: ''});
      expect(target.test.error).toEqual('Required');
      expect(target.test.message).toEqual("is required");
    });
  });
});
