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
       
    }
    
, titulo: {
    type: String,
    
    
}, categoria: {
    type: String,
      
    
}
, noticia: {
    type: String
       
}

});

module.exports = mongoose.model('Noticia', userSchema);
