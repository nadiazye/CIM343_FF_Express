const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello from Express");
});

app.get("/hello", (req, res) => {
    res.send("hello world");
});

app.get("/home", (req, res) => {
    res.render("home", { title: "My home page" });
});

app.get("/form", (req, res) => {
    res.render("survey", { title: "Survey" });
});

app.post("/form", (req, res) => {
    const animal = req.body.animal;

    let votes = { narwhal: 0, seal: 0, penguin: 0 };

    if (req.cookies.votes !== undefined) {
        votes = req.cookies.votes;
    }

    // Only count a vote if an animal was actually chosen
    if (animal) {
        if (votes[animal] === undefined) {
            votes[animal] = 0;
        }
        votes[animal] = votes[animal] + 1;
    }

    res.cookie("votes", votes, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.render("response", { votes: votes });
});

// Clear votes (GET so you can just visit /clear or use a link)
app.get("/clear", (req, res) => {
    res.clearCookie("votes");
    res.send("Votes cleared. <a href='/form'>Back to form</a>");
});

// Chart.js example: draw a bar chart from the votes cookie
app.get("/chart", (req, res) => {
    let votes = { narwhal: 0, penguin: 0, seal: 0 };

    if (req.cookies.votes !== undefined) {
        votes = req.cookies.votes;
    }

    res.render("chart", {
        title: "Vote Chart",
        votes: JSON.stringify(votes)
    });
});


app.get("/api/animals", (req, res) => {
    res.json(["narwhal", "penguin", "seal"]);
});

app.get("/dogs", (req, res) => {
    res.render("dogform", { title: "Add a Dog" });
});


app.post("/dogs", (req, res) => {
    const name = (req.body.name || "").trim();
    const breed = req.body.breed;

    let dogs = [];
    if (req.cookies.dogs !== undefined) {
        dogs = req.cookies.dogs;
    }

    if (name && breed) {
        dogs.push({ name: name, breed: breed });
    }

    res.cookie("dogs", dogs, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect("/dogchart");
});


app.get("/dogchart", (req, res) => {
    let dogs = [];
    if (req.cookies.dogs !== undefined) {
        dogs = req.cookies.dogs;
    }

    
    let counts = {};
    for (let dog of dogs) {
        counts[dog.breed] = (counts[dog.breed] || 0) + 1;
    }

    res.render("dogchart", {
        title: "Dogs by Breed",
        dogs: dogs,
        
        counts: JSON.stringify(counts).replace(/</g, "\\u003c")
    });
});

app.delete("/dogs/clear", (req, res) => {
    res.clearCookie("dogs");
    res.send("Dogs cleared");
});

app.get("/:name", (req, res) => {
    res.send("My name is: " + req.params.name);
});

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});