const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

const articleSchema = {
    title: String,
    content: String
};

const Wiki = mongoose.model("Article", articleSchema);

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("Public"));

app.set("view engine", "ejs");

////////////////////////////////////Request Targeting All Articles////////////////////////////////////

app.route("/articles")
    .get((req, res) => {

        Wiki.find({}, (err, articles) => {

            if (!err) {
                res.send(articles);
            } else {
                res.send(err)
            };


        });

    })
    .post((req, res) => {

        const newArticle = new Wiki({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            };
        });
    })
    .delete((req, res) => {
        Wiki.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            };
        });
    });

////////////////////////////////////Requests That Target A Specific Article////////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {

        Wiki.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles found!")
            }
        });
    })
    .put((req, res) => {
        Wiki.replaceOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            }
        });
    })
    .patch((req, res) => {
        Wiki.updateOne({
            title: req.params.articleTitle
        }, {
            $set: req.body
        }, (err) => {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err)
            }
        });
    })
    .delete((req, res) => {
        Wiki.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if (!err) {
                res.send("Successfully deleted the article.");
            } else {
                res.send(err)
            }
        })
    });



app.listen(3000, (req, res) => {
    console.log("Server running on port 3000...");
});