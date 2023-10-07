// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
    getDatabase,
    set, 
    ref, 
    push
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBprFzh6BOrh3SWJlDIrHzCrCgFvzAPGFs",
  authDomain: "quiz-app-d387d.firebaseapp.com",
  projectId: "quiz-app-d387d",
  storageBucket: "quiz-app-d387d.appspot.com",
  messagingSenderId: "887502568144",
  appId: "1:887502568144:web:e998466b73f83f2feffcd5",
  measurementId: "G-8Q27RE1KJS"
};

//  Initialize Firebase
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var DATABASE = getDatabase(app);


 var email = document.getElementById("email");
 var password = document.getElementById("password"); 
 var confirmPassword = document.getElementById("confirmPassword");
 window.signUp = function(){
     var user = {
         email : email.value,
         password : password.value
     }
     // console.log("running");
     if(password.value != confirmPassword.value){
         document.getElementById("error1").innerHTML = "password and confirm password must be same";
     }else{
         createUserWithEmailAndPassword(auth,email.value,password.value)
         .then(function(success){
            // var userUid = success.user.uid;
            // user.id = userUid;
            var refLog = ref(DATABASE);
            var refLogData = push(refLog).key;
            user.id = refLogData;
            var refer = ref(DATABASE, `users/${user.id}`);
            set(refer, user)   
             .then(function () {
                console.log("User data saved in the database");
                email.value = "";
                password.value = "";
                confirmPassword.value = "";
                document.getElementById("error1").innerHTML = "";
                window.location.replace("./quiz.html");
              })
            })
         .catch(function(error){
             console.log(error.code);
             if(error.code === "auth/weak-password"){
             // console.log("Password should be atleast 8 characters");
             document.getElementById("error").innerHTML = "Password should be atleast 8 characters";
         }else if(error.code == "auth/email-already-in-use"){
          document.getElementById("error2").innerHTML = "Email already in use........";
         }
         else{
             document.getElementById("error").style.display = "none";
             document.getElementById("error2").style.display = "none";
         }
         })
     }  
 };
 
 
 //=============== signIn===================
 window.signIn = function(){
     signInWithEmailAndPassword(auth,email.value,password.value)
     .then(function(success){
        //  console.log(success);
         window.location.replace("./quiz.html")
     })
     .catch(function(error){
      if(error.code == "auth/invalid-login-credentials"){
        document.getElementById("error3").innerHTML = "Invalid Email.........";
      }
        //  console.log(error);
     })
 };    

var questionData = [{
    question : "What is the Full Form of HTML?",
    options : ['Hyper Text Makeup Language','Hyper Text Markup Language','Hyper Text Markup Lame','HyperTate Markup Language'],
    answer : "Hyper Text Markup Language"
},
{
    question : "What does CSS stands for?",
    options : ['Common Style Sheet','Colorful Style Sheet','Computer Style Sheet','Cascading Style Sheet'],
    answer : "Cascading Style Sheet"
},
{
    question : "What does PHP stands for?",
    options : ['Hypertext preprocessor','Hypertext programming','Hypertext popup','Hypertact preprocessor'],
    answer : "Hypertext preprocessor"
},
{
    question : "What does SQL stands for?",
    options : ['Stylish Question Language','Stylesheet Query Language','Statement Question Language','Structured Query Language'],
    answer : "Structured Query Language"
},
{
    question : "What was JavaScript launched?",
    options : ['1996','1995','1994','None of the above'],
    answer : "1995"
},
];

var infoBox = document.getElementById("infoBox");
var Start= document.getElementById("Start");
window.startButton = function(){
    infoBox.style.display = "block";
    Start.style.display = "none";
    document.getElementById("scoreCard").style.display = "none";

}
window.exitQuiz =function (){
    infoBox.style.display = "none";
    Start.style.display = "block";
    document.getElementById("scoreCard").style.display = "none";

}

window.continueQuiz = function (){
    infoBox.style.display = "none";
    Start.style.display = "none";
    document.getElementById("Quiz").style.display = "block";
    renderText();
}

var questionText = document.getElementById("questionTxt");
var options = document.getElementById("options");
var questionCount= document.getElementById("questionCount");
var questionIndex = 0;
var score = 0;


function renderText(){
    if(questionIndex < questionData.length){
     questionText.innerHTML = questionData[questionIndex].question;
     questionCount.innerHTML =`Question Count ${questionIndex + 1}/${questionData.length}`;
    //  startTimer(15);
     options.innerHTML = "";
     for(var i=0; i< questionData[questionIndex].options.length; i++){
        options.innerHTML += `
        <div class="col-md-6 mt-4">
          <div class="p-2 shadow-lg rounded-pill bg-white">
            <button onclick="checkAns('${questionData[questionIndex].options[i]}','${questionData[questionIndex].answer}')" 
            class="btn w-100 fs-4 fw-bold">${questionData[questionIndex].options[i]}</button>
          </div>
        </div>`;
    
     }
    }else{
        document.getElementById("Quiz").style.display = "none";
        document.getElementById("score").textContent = score;
        document.getElementById("scoreCard").style.display = "block";
        console.log(score);
        var refQuiz = ref(DATABASE);
        var quizId = push(refQuiz).key;
        var refData = ref(DATABASE,`QuizMarks/${quizId}/score`);
        set(refData,score);
    }     
}
renderText();
 
window.nextQuestion = function(){
    questionIndex++;
    renderText();

}
 window.checkAns = function(userSelectedAns,correctAns){
    if(userSelectedAns === correctAns){
        score++;
    }
    else{
        console.log("wrong");
    }
    console.log("score=====>",score);
    nextQuestion();
}
window.restartQuiz = function(){
    window.location.replace("./signUp.html");
}
