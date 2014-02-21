define(['release/okay'], function(okay) {
  describe('Okay.MinLength', function() {

    var Length = okay.Define({test: okay.MinLength(4)});

    it('should give error when field is shorter than min length', function() {
      var target = new Length({test: ''});
      expect(target.test.error).toEqual("MinLength");
      expect(target.test.message).toEqual("must be at least 4 characters");
    });

    it ('should not give error when field is equal to min length', function() {
      var target = new Length({test: 'ABCD'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is longer than min length', function() {
      var target = new Length({test: 'ABCDEFG'});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.MaxLength', function() {

    var Length = okay.Define({test: okay.MaxLength(4)});

    it('should give error when field is more than value', function() {
      var target = new Length({test: 'ABCDEFG'});
      expect(target.test.error).toEqual("MaxLength");
      expect(target.test.message).toEqual("must be no more than 4 characters");
    });

    it ('should not give error when field is equal to max length', function() {
      var target = new Length({test: 'ABCD'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is less than value', function() {
      var target = new Length({test: 'ABC'});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.MinMaxLength', function() {

    var Length = okay.Define({test: okay.MinMaxLength(4, 8)});

    it('should give error when field is shorter than min value', function() {
      var target = new Length({test: 'ABC'});
      expect(target.test.error).toEqual("MinMaxLength");
      expect(target.test.message).toEqual("must be between 4 and 8 characters");
    });

    it ('should not give error when field same length as min value', function() {
      var target = new Length({test: 'ABCD'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is longer than min value', function() {
      var target = new Length({test: 'ABCDEFG'});
      expect(target.test).not.toBeDefined();
    });

    it('should give error when field is longer than max value', function() {
      var target = new Length({test: 'ABCDEFGHI'});
      expect(target.test.error).toEqual("MinMaxLength");
      expect(target.test.message).toEqual("must be between 4 and 8 characters");
    });

    it ('should not give error when field is same length as max value', function() {
      var target = new Length({test: 'ABCDEFGH'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is longer than max value', function() {
      var target = new Length({test: 'ABCDEFG'});
      expect(target.test).not.toBeDefined();
    });
  });
});
