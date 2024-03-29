const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

const app = express();
// ejs view engine
app.set('view engine', 'ejs');

// static

app.use(express.static('public'));
// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database connection
connection.authenticate()
  .then(() => {
    console.log('Conexão com o DB feita com sucesso.');
  }).catch((error) => {
    console.log(error);
  });

app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC'],
    ],
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', {
        articles,
        categories,
      });
    });
  });
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  Article.findOne({
    where: {
      slug,
    },
  }).then((article) => {
    if (article != undefined) {
      Category.findAll().then((categories) => {
        res.render('article', {
          article,
          categories,
        });
      });
    } else {
      res.redirect('/');
    }
  }).catch((error) => res.redirect('/'));
});

app.listen(3333, () => {
  console.log('Rodando...');
});
