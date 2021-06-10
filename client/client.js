// static server

console.log("helllo world");

const form  = document.querySelector('form');
const loadingGIF  = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/tweets';
const tweetElement = document.querySelector('.tweets');

loadingGIF.style.display = ""; 


listAllTweets();

// document refers to client side javascript.
//cors is a npm package which is a express middleware that enables cross origin requests.

form.addEventListener('submit' , (event)=>{
  event.preventDefault(); 
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  const tweet = {
    name ,
    content
  };

  form.style.display = "none"; 
  loadingGIF.style.display = ""; 
  
  fetch(API_URL ,{
    method : 'POST',
    body : JSON.stringify(tweet),
    headers : {
      'content-type': 'application/json'
    }  
  }).then(response => response.json())
    .then(createdTweet =>{
       form.reset();
       setTimeout(() => {
        form.style.display = "";   
       }, 30000);
       
      listAllTweets();
      loadingGIF.style.display = "none"; 
    });

});

 function listAllTweets() {
   tweetElement.innerHTML = '';
   fetch(API_URL)
   .then(reponse => reponse.json())
   .then(tweets =>{
    console.log(tweets);
    tweets.reverse();
    tweets.forEach(tweet  => {
      const div = document.createElement('div');
      const header = document.createElement('h2');
      header.textContent = tweet.name;
      const contents = document.createElement('p');
      const date = document.createElement('small');
      date.textContent = new Date(tweet.created);
      contents.textContent = tweet.content;
      
      div.appendChild(header);
      div.appendChild(contents);
      div.appendChild(date); 

      tweetElement.appendChild(div);

      loadingGIF.style.display = "none";


     
    });
    });
 }