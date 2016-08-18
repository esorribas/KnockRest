# KnockRest
###A simple Knockout REST library for CRUD operations
###Made with Knockout.js and jQuery

####How to use it:

######1) Create a Knockout model:

```javascript
var myViewModel = {
    _id: ko.observable(''),
    username: ko.observable(''),
    firstName: ko.observable(''),
    list: ko.observableArray([])
};

ko.applyBindings(myViewModel);
```

We need to create a dummy "list" observableArray attribute to fetch all objects from API

######2) Configure your KnockRest object:

```javascript
var kr = new KnockRest('http://localhost:3000/api/users', myViewModel, '_id');
```

######3) Attach event handlers:

```javascript
$('#btnList').click(function() {
    kr.list();
});

$('#btnSave').click(function() {
    kr.save();
});

$('#btnDelete').click(function() {
    kr.delete();
});

$('body').on('click', '.load', function() {
    kr.get($(this).attr('id'));
});
```
