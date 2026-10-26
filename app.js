const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "hbs");

app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.send("Hello from Express");
});

app.get("/hello", (req,res)=>{
    res.send("hello world");
});

app.get("/home", (req, res) =>{
    res.render("home", {title: "My home page"})
});

app.get("/:name", (req, res) =>{
    res.send("My name is: " + req.params.name);
});


//end of code
app.listen(port, ()=> {
    console.log("Server Running at http://localhost:${port}");
})