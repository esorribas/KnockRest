// KnockRest Library 0.1
// Helps to interact with a REST API and update the changes
// automatically in your Knockout model objects.
// endpoint: the base of your API
// model: your instance of Knockout model
// idField: the name of your model primary key
var KnockRest = function(endpoint, model, idField) {
    var self = this;

    // Gets a model by an id
    self.get = function(id, callback) {
        // Populate the id field to generate the endpoint
        self.setId(id);

        // Obtains the model and update the data in the knockout model
        $.getJSON(self.getIdEndpoint(), function(data) {
            self.JsonToModel(data);
        });
    };

    // Gets all your objects
    self.list = function(callback) {
        $.getJSON(endpoint, function(data) {
            //Check if exists the observableArray "list" to populate it
            if ($.isFunction(model.list)) {
                model.list(data);
            }
        });
    };

    // Create or update your object to API
    self.save = function() {
        var method = (self.isNew() === true) ? 'post' : 'put';

        $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            url: self.getIdEndpoint(),
            data: self.modelToJson(),
            dataType: 'json',
            success: function(data) {
                self.clearModel();
            },
            error: self.manageXhrError
        });
    };

    // Delete a model by an id
    self.delete = function() {
        if (self.isNew() === false) {
            $.ajax({
                type: 'delete',
                contentType: 'application/json; charset=utf-8',
                url: self.getIdEndpoint(),
                data: {},
                dataType: 'json',
                success: self.clearModel,
                error: self.manageXhrError
            });
        }
    };

    // Manage the error responses from API
    self.manageXhrError = function(xhr) {
        if (xhr && xhr.status) {
            throw xhr.status + ': ' + xhr.statusText;
        } else {
            throw '000: Unexpected error';
        }
    };

    // Resets the Knockout model to get ready for new changes (insert, get, etc)
    self.clearModel = function() {
        if (model) {
            for (var prop in model) {
                // Check if property exists on Knockout model and reset the value
                if (model.hasOwnProperty(prop) && ko.isObservable(model[prop])) {
                    model[prop](undefined);
                }
            }

            // Get all models again
            self.list();
        }
    };

    // Update from a JSON object the Knockout model automatically
    self.JsonToModel = function(data) {
        if (data) {
            for (var d in data) {
                if ($.isFunction(model[d])) {
                    model[d](data[d]);
                }
            }
        }
    };

    // Gets the JSON object from Knockout model to send to API
    self.modelToJson = function() {
        return ko.toJSON(model);
    };

    // Sets the Id field value
    self.setId = function(id) {
        // Check if the id field exist on Knockout model to set the value of it
        if ($.isFunction(model[idField])) {
            model[idField](id);
        } else {
            throw 'The function ' + idField + '() does not exists';
        }
    };

    // Gets the Id field value
    self.getId = function() {
        // Check if the id field exist on Knockout model to return the value of it
        if ($.isFunction(model[idField]) && model[idField]()) {
            return model[idField]();
        } else {
            return null;
        }
    };

    // Returns the related endpoint according the id field value
    self.getIdEndpoint = function(id) {
        return (self.isNew() === false) ? endpoint + '/' + self.getId() : endpoint;
    };

    // Checks if the Knockout model is a new object or not based on the id field value
    self.isNew = function() {
        return (self.getId() === null || self.getId() === '' || self.getId() === 0);
    };
};
