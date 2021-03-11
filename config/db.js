require('dotenv').config();
// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI).then( ()=> {
//     console.log('DB connected');
// }).catch( (error) => console.log(error));
// mongoose.connect(process.env.MONGODB_URI, {userNewUrlParser: true, useUnifiedTopology: true}).then( ()=> {
//     console.log('DB connected');
// }).catch( (error) => console.log(error))

const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGODB_URI).then( () => {
    console.log('DB connected');
}).catch( (error) => console.log(error));

mongoose.Promise = global.Promise;
module.exports = mongoose