const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "First Name": {
        type: String,
        required: true,

    },
    "Last Name": {
        type: String,
        required: true,

    },
    "Email": {
        type: String,
        required: true,

    },
    "Last Login": {
        type: String,


    },
    "Created": {
        type: String,
        required: true,

    },
    "Password": {
        type: String,
        required: true,

    },
    "token": {
        type: String,
      },
    "Roles": [
         {
            type: String
        },
        
    ],
    "Orders": [{
        
        
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        
    }],

    "Permissions": [{
        "name": {
            type: String
        },
        "value": {
            type: String
        }
    }],
    "Activated": {
        type: Boolean,
        required: true,

    },

});

module.exports = User = mongoose.model("users", userSchema);