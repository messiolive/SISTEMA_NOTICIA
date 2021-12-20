const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
       email: {
        type: String,
        required: true,
        unique: true
    },
    data: { type: Date, default: Date.now },
   
    autor:{
        type: String,
        required: true
    }
    
, titulo: {
    type: String,
    required: true
    
}, categoria: {
    type: String,
        required: true
    
}
, noticia: {
    type: String,
        required: true
}

});

module.exports = mongoose.model('Noticia', userSchema);
