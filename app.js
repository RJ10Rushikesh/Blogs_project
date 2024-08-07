import express from "express";
import Blog from "./models/blog.js";
import mongoose from "mongoose";
import { render } from "ejs";

const app = express();
app.set("view engine", "ejs");
const port = 3000;

// connecting to mongodb
const dbURI =
  "mongodb+srv://user1:rushi4590@cluster0.9zm6maa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI).catch((err) => console.log("line no 18 : ", err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Place the /blogs/create route before /blogs/:id
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create" });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete('/blogs/:id', (req,res) => {
  const id = req.params.id

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({redirect: '/blogs'})
    })

    .catch((err) => {
      console.log(err)
    })
})

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not found" });
});

app.listen(port, () => {
  console.log("listening on port 3000");
});
