//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const wikiSchema = mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", wikiSchema);

const input = new Article({
  title: "REST",
  content: "REST is short for representational state transfer."
});

Article.find({}, function(err, foundArticles) {
  if (foundArticles.length === 0) {
    input.save();
  }
  if (err) {
    console.log(err);
  };

});


////////////////////////////Requests targeting all articles//////////////////////

app.route("/articles").get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  })
}).post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  })

}).delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    };
  });
});

////////////////////////////Requests targeting specific articles//////////////////////

app.route("/articles/:articlesTitle")

  .get(function(req, res) {
    Article.findOne({
      name: req.params.articlesTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    })
  }).put(function(req, res) {
    Article.findOneAndUpdate({
        name: req.params.articlesTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    )
  }).patch(function(req, res) {
    Article.findOneAndUpdate({
        title: req.params.articlesTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article");
        } else {
          res.send(err);
        }
      }
    )
  }).delete(function(req, res) {
    Article.findOneAndDelete(
      {title: req.params.articlesTitle},
      function(err) {
        if(!err) {
          res.send("Successfully deleted article");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen("3000", function() {
  console.log("server is running at port 3000");
});
