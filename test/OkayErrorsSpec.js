define(['amd/okay'], function(okay) {
  describe('Okay.errors', function() {

    var Default = okay.defineWrapper({test: okay.Required()});

    it('should give error when field is undefined', function() {
      var target = new Default({decoy: ''});
      expect(target.any()).toBeTruthy();
      var errors = target.errors();
      expect(errors.test).toBeDefined();
      expect(errors.test.error).toEqual('Required');
      expect(errors.test.message).toEqual("is required");
      expect(errors.decoy).not.toBeDefined();
    });
  });

  describe('Okay.check', function() {

    var Default = okay.defineWrapper({test: okay.Required()});

    it('should give error when field is undefined', function() {
      var errors = Default.check({decoy: ''});
      expect(errors.test).toBeDefined();
      expect(errors.test.error).toEqual('Required');
      expect(errors.test.message).toEqual("is required");
      expect(errors.decoy).not.toBeDefined();
    });
  });
});
