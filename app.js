const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Hello from Express");
});

app.get("/hello", (req,res)=>{
    res.send("hello world");
});

app.get("/home", (req, res) =>{
    res.render("home", {title: "My home page"})
});

app.get("/form", (req, res)=>{
    res.render("survey", {title: "Survey"});
});

app.post("/form", (req, res)=>{
    //res.send("form processed");
    const animal = req.body.animal; //Animal that I selected from the form

    let votes = {
        narwhal:0,
        seal:0,
        penguin:0
    };

    if(req.cookies.votes !== undefined){
        votes = req.cookies.votes;
    }

    if(votes[animal] === undefined){
        votes[animal] = 0
    }

    votes[animal] = votes[animal] + 1;

    res.cookie("votes", votes, {maxAge: 7 * 24 * 60 * 60 * 1000});

    res.render("response", {
        votes: votes
    });
});

app.get("/:name", (req, res) =>{
    res.send("My name is: " + req.params.name);
});

app.delete("/clear", (req, res)=>{
    res.clearCooki9e("votes");
    res.send("Votes cleared" + "<a href='/form'>Back to form</a>")
})

// Chart.js example: draw a bar chart from the votes cookie
app.get("/chart", (req, res) => {
  // 1. Start every animal at 0 votes
  let votes = {
    narwhal: 0,
    penguin: 0,
    seal: 0
  };

  // 2. If the browser already has a votes cookie, use those counts instead
  if (req.cookies.votes !== undefined) {
    votes = req.cookies.votes;
  }

  // 3. Send the whole votes object as JSON text so the template can drop it into <script>
  res.render("chart", {
    title: "Vote Chart",
    votes: JSON.stringify(votes)
  });
});

app.get("/:name", (req, res)=>{
    res.send("My name is: " + req.params.name);
});

// A route that sends JSON
app.get("/api/animals", (req, res) => {
  res.json(["narwhal", "penguin", "seal"]);
});

//end of code
app.listen(port, ()=> {
    console.log("Server Running at http://localhost:${port}");
})