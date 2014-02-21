define(['release/okay'], function(okay) {
  describe('Okay.Min', function() {

    var Min = okay.Define({test: okay.Min(23)});

    it('should give error when field is less than value', function() {
      var target = new Min({test: 0});
      expect(target.test.error).toEqual("Min");
      expect(target.test.message).toEqual("must be at least 23");
    });

    it ('should not give error when field is equal to value', function() {
      var target = new Min({test: 23});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is greater than value', function() {
      var target = new Min({test: 42});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.Max', function() {

    var Max = okay.Define({test: okay.Max(42)});

    it('should give error when field is more than value', function() {
      var target = new Max({test: 43});
      expect(target.test.error).toEqual("Max");
      expect(target.test.message).toEqual("must be no more than 42");
    });

    it ('should not give error when field is equal to value', function() {
      var target = new Max({test: 42});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is less than value', function() {
      var target = new Max({test: 0});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.MinMax', function() {

    var MinMax = okay.Define({test: okay.MinMax(23, 42)});

    it('should give error when field is less than min value', function() {
      var target = new MinMax({test: 0});
      expect(target.test.error).toEqual("MinMax");
      expect(target.test.message).toEqual("must be between 23 and 42");
    });

    it ('should not give error when field is equal to min value', function() {
      var target = new MinMax({test: 23});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is greater than min value', function() {
      var target = new MinMax({test: 42});
      expect(target.test).not.toBeDefined();
    });

    it('should give error when field is more than max value', function() {
      var target = new MinMax({test: 43});
      expect(target.test.error).toEqual("MinMax");
      expect(target.test.message).toEqual("must be between 23 and 42");
    });

    it ('should not give error when field is equal to max value', function() {
      var target = new MinMax({test: 42});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is less than max value', function() {
      var target = new MinMax({test: 30});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.Min Date', function() {

    var Min = okay.Define({test: okay.Min(new Date('2014-02-21'))});

    it('should give error when field is less than value', function() {
      var target = new Min({test: '2014-02-20'});
      expect(target.test.error).toEqual("Min");
      expect(target.test.message).toEqual("must be no earlier than Fri Feb 21 2014");
    });

    it ('should not give error when field is equal to value', function() {
      var target = new Min({test: '2014-02-21'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is greater than value', function() {
      var target = new Min({test: '2015-01-01'});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.Max Date', function() {

    var Max = okay.Define({test: okay.Max(new Date('2014-02-21'))});

    it('should give error when field is more than value', function() {
      var target = new Max({test: '2015-01-01'});
      expect(target.test.error).toEqual("Max");
      expect(target.test.message).toEqual("must be no later than Fri Feb 21 2014");
    });

    it ('should not give error when field is equal to value', function() {
      var target = new Max({test: '2014-02-21'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is less than value', function() {
      var target = new Max({test: '2014-01-01'});
      expect(target.test).not.toBeDefined();
    });
  });

  describe('Okay.MinMax', function() {

    var MinMax = okay.Define({test: okay.MinMax(new Date('2014-01-01'), new Date('2014-12-31'))});

    it('should give error when field is less than min value', function() {
      var target = new MinMax({test: '2000-01-01'});
      expect(target.test.error).toEqual("MinMax");
      expect(target.test.message).toEqual("must be between Wed Jan 01 2014 and Wed Dec 31 2014");
    });

    it ('should not give error when field is equal to min value', function() {
      var target = new MinMax({test: '2014-01-01'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is greater than min value', function() {
      var target = new MinMax({test: '2014-01-02'});
      expect(target.test).not.toBeDefined();
    });

    it('should give error when field is more than max value', function() {
      var target = new MinMax({test: '2015-01-01'});
      expect(target.test.error).toEqual("MinMax");
      expect(target.test.message).toEqual("must be between Wed Jan 01 2014 and Wed Dec 31 2014");
    });

    it ('should not give error when field is equal to max value', function() {
      var target = new MinMax({test: '2014-12-31'});
      expect(target.test).not.toBeDefined();
    });

    it ('should not give error when field is less than max value', function() {
      var target = new MinMax({test: '2014-12-30'});
      expect(target.test).not.toBeDefined();
    });
  });
});
