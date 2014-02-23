# OkayJS

> Validation for JavaScript objects

### This is not a Form Validation Library

I went looking for something I could use in AngularJS to validate the *models*, rather than the forms, and I couldn't find anything. So I made this. It's not specific to AngularJS, although there is a convenient Angular module you can reference to include it as a Service with a Provider. There's also an AMD module wrapper for RequireJS users, a CommonJS wrapper for use server-side with Node.js, and just the plain old JavaScript.

## Validations supported

* Required
* IsNumeric
* IsDate
* Min, Max, MinMax *(for numbers and dates)*
* Length, MinLength, MaxLength, MinMaxLength *(for strings)*
* Regex
* Custom *(using functions)*

## Usage

### Installation

Unpublished as yet, but compiled files are included in the repo, so copy and paste away.

### Syntax

**Okay** works by wrapping an object in a validating object, and specifying rules for properties. The wrapper will expose properties for each of the rules, and each property will return an error object if the rules are not met, and `undefined` if they are. This makes it easy to bind to the error properties in Angular, which is what I'm using when I'm not getting sidetracked into open-sourcing bits of my code.

Validations are represented by methods on the Okay module. Assign validations to properties using an object where the keys are the same as the property names in your model, and the values are either a single validation or an array of validations to be applied in order. That barely makes sense. Look, here's an

### Example

To wrap an object with a rule that the `name` property is **required** and the `age` property is **required** and **must be numeric**:

```javascript
require(['okay'], function(okay) {
  var person = {};
  var personErrors = okay.wrap(person, {
    name: okay.Required(),
    age: [okay.Required(), okay.Number()]
  });

  // personErrors.name == { error: 'Required', message: 'is required' }
  // personErrors.age == { error: 'Required', message: 'is required' }

  person.name = 'Alice';

  // personErrors.name == undefined
  // personErrors.age == { error: 'Required', message: 'is required' }

  person.age = 'None of your business';

  // personErrors.age == { error: 'Number', message: 'is not a numeric value' }

}); 
```

#### Available validations

```javascript
okay.Required();

okay.IsDate();
okay.IsNumeric();

okay.Min(1);
okay.Max(10);
okay.MinMax(1,10);

okay.Min(new Date(2014,1,1));
okay.Max(new Date(2014,12,31));
okay.MinMax(new Date(2014,1,1), new Date(2014,12,31));

okay.Length(5);
okay.MinLength(2);
okay.MaxLength(4);
okay.MinMaxLength(2,4);

okay.Regex(/^[YNM]$/i);

okay.Custom(function(v) { return v.indexOf('please') >= 0; });
```

### Outputs

The error property on the returned object will be the name of the validation that failed.

You can customize the message by passing it as an extra parameter to the validator function, e.g.

```javascript
okay.wrap(person, {
  name: okay.Required("What's your name, scumbag?")
});
```

# TODO

* More tests, especially for Node.js usage
* Method to set default messages globally
* Method to set default messages for a specific validation
* Explicit test runs
* Stuff

## 0.0.1-RFC

This is completely new, and also the first real JavaScript library I've built, so comments and contributions much appreciated.