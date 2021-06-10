// dynamic server
const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit'); 


const app = express();

// creating connection to the database
const db = monk('localhost/TwitterDB');

// mongo works with collections so we have differnt collections of data.
const tweets = db.get('tweets');
// filter bad words
const filter = new Filter();

// tweets here is a collection inside our database.
// we can think of a collections as an array of data.




app.use(cors());
// cors is the middleware, so any incoming request will pass through this middlware
// and cors will automatically add the headers to it. 
app.use(express.json());
// it is a json body parser built into express , any content of type application/json
// will be passed by this middleware 




app.get('/'   ,(req , res) => {
  res.json({
    message : 'hii there !!!'
  });
});

app.get('/tweets' ,  (req ,res) => {
  // tweets represents collection
  tweets
    .find()
    .then(tweets => {
      res.json(tweets);
    })
});


 function isValidTweet(tweet){
   return tweet.name && tweet.name.toString().trim() !== "" &&
   tweet.content && tweet.content.toString().trim() !== "";
 }

//rate limiter express
app.use(rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1 // limit each IP to 100 requests per windowMs
}));

app.post('/tweets',(req ,res) => {
  if (isValidTweet(req.body)) {
    // insert into db
    const tweet = {
      name : filter.clean(req.body.name.toString()),
      content : filter.clean(req.body.content.toString()),
      created : new Date()
    };
   
    tweets
    .insert(tweet)
    .then(createdTweet =>{
     res.json(createdTweet);
    });
         

  }else{
   res.status(422);
   res.json('Hey : Name and content are required !!!'); 
  }

   console.log(req.body);
});

// stating the backend server
app.listen(5000 , () => {
  console.log('listening on http://localhost:5000');  
}); 



