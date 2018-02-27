const mongoose = require('mongoose');

let statusSchema = mongoose.Schema({
    s_text: {
      type: String
    },
    t_status:{
      type: Date,
      default: Date.now
    },
    createdAt:{
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Status', statusSchema);
