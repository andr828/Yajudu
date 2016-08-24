var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yajidu', function(err) {
    console.log('connected to mongodb');
});

module.exports = mongoose;