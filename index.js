const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const LRU = require("./lru");

let lru;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate");

const port =process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server running on port", port);
});

app.get("/lru-cache", (req, res) => {
    res.render("cache_capacity");
});

app.get("/lru-cache/capacity", (req, res) => {
    const capacity = parseInt(req.query.capacity);
    if (!isNaN(capacity) && capacity > 0) {
        res.render("home", { capacity });
    } else {
        res.render("home", { capacity: '' });
    }
});

app.post("/lru-cache/capacity", (req, res) => {
    let capacity = parseInt(req.body.capacity);
    lru = new LRU(capacity);
    res.render("home", { capacity });
});

app.post("/lru-cache/put", (req, res) => {
    if (!lru) {
        return res.send("Please set capacity first.");
    }
    console.log("Received key:", req.body.key);
    console.log("Received value:", req.body.value);
    let key = req.body.key;
    let value = req.body.value;
    lru.put(key, value);
    console.log("Cache contents:", lru.getEntries());
    res.render("design", { cache: lru.getEntries(), foundKey: null, foundValue: null ,capacity: lru.capacity });
});

app.post("/lru-cache/get", (req, res) => {
        if (!lru) {
            return res.send("Please set capacity first.");
        }
        let key = req.body.key;
        let value = lru.get(key);
        res.render("design", { 
            cache: lru.getEntries(), 
            foundKey: key, 
            foundValue: value, 
            capacity: lru.capacity 
        });
    });
    
