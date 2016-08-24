'use strict';

/**
 * Module dependencies.
 */
// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     crypto = require('crypto');

var db = require('../../connection.js');
var Schema = db.Schema;
var crypto = require('crypto');

// var db = mongoose.connect('mongodb://localhost/yajidu', function(err) {
//     // if (err) {
//     //     console.error(chalk.red('Could not connect to MongoDB!'));
//     //     console.log(chalk.red(err));
//     // }
//     console.log('connected to mongodb');
// });




/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        unique: 'Username already exists',
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer than 6 charaters'],
        match: [/^((?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s).*)$/, 'Password must contain combination charaters and numbers']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['client', 'freelancer', 'admin']
        }],
        default: ['client']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    skills: [{
        type: Schema.ObjectId,
        ref: 'Skill'
    }],
    files: [{
        type: String
    }],
    phoneNumber: {
        type: String
    },
    faxNumber: {
        type: String
    },
    websiteUrl: {
        type: String
    },
    instantMessaging1: {
        type: String
    },
    instantMessaging2: {
        type: String
    },
    instantMessaging3: {
        type: String
    },
    instantMessagingType1: {
        type: String
    },
    instantMessagingType2: {
        type: String
    },
    instantMessagingType3: {
        type: String
    },
    addressLine1: {
        type: String,

    },
    addressLine2: {
        type: String,

    },
    // cityStateCountry: {
    //     type: String
    // },
    zipCode: {
        type: String
    },
    addDisplayOptions: {
        type: String,
        default: 'hide_name'
    },
    contactInfoVisibility: {
        type: String,
        default: 'contact_all'
    },
    companyName: {
        type: String,
        trim: true,
        default: ''
    },
    tagLine: {
        type: String,
        default: ''
    },
    numberOfEmployees: {
        type: String,
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    youtubeVideoUrl: {
        type: String,
    },
    shortProfile: {
        type: String,
        default: ''
    },
    educationAndExperience: {
        type: String,
        default: ''
    },
    paymentTerms: {
        type: String,
    },
    keywords: {
        type: String,
    },
    showProfile: {
        type: Boolean,
        default: false
    },
    enableIndexing: {
        type: Boolean,
        default: false
    },
    enableJobPostIndexing: {
        type: Boolean,
        default: false
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: 'no-avatar.png'
    },
    socialPictureURL: {
        type: String,
        default: ''
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    subcategory: {
        type: Schema.ObjectId,
        ref: 'Subcategory'
    },
    categories: [{
        type: Schema.ObjectId,
        ref: 'Category'
    }],
    subcategories: [{
        type: Schema.ObjectId,
        ref: 'Subcategory'
    }], 
    history: [{
        type: Schema.ObjectId,
        ref: 'FeedBack'
    }],
    totalEarnings : {
        type: Number,
        default: 0
    }, averageRating: {
        type: Number,
        default: 0
    },
    country: {
        type: String,
        default: 'Qatar'
    },
    city: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date, 
        default: Date.now
    },
    emailVerificationToken: {
        type: String, 
        default: ''
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    isActive: {
        type: Boolean, 
        default: true
    },
    nationality: {
        type: String,
        default: ''
    },
    interests: {
        type: String,
        default: ''
    },
    dob: {
        type: String, 
        default: ''
    }

});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
UserSchema.virtual('cityStateCountry').get(function () {
    if(this.location && this.location !==''){
        return this.location+', '+this.city+', '+this.country;
    }else if (this.city && this.city !=='') {
        return this.city+', '+this.country;
    }else{
        return this.country;
    };
    
});
UserSchema.virtual('profilePictureURL').get(function () {
    if(this.provider === 'local'){
        return '/uploads/'+this.profilePicture;
    }else{
        return this.socialPictureURL;
    };
});

db.model('User', UserSchema);
