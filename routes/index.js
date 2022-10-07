var express = require('express');
var router = express.Router();

const db = require('../models');
const User = db.users;
const News = db.berita;
const Comment = db.comments;
const Op = db.Sequelize.Op;


var bcrypt = require('bcryptjs');

const auth = require('../auth');
const comment = require('../models/comment');

/* GET home page. */

router.get('/', function (req, res, next) {
  News.findAll()
    .then(databerita => {
      res.json({
        data: databerita
      });
    })
    .catch(err => {
      res.json({
        data: []
      });
    });
});

// Webpage
router.get('/daftarberita', auth, function (req, res, next) {
  News.findAll()
    .then(edit => {
      res.json({
        data: edit
      });
    })
    .catch(err => {
      res.json({
        data: []
      });
    });
});

//Laman Berita
router.get('/newspage', function (req, res, next) {
  var id = parseInt(req.query.id); // productdetail?id=xxx
  // query ke database
  // select * from product where id=id
  News.findByPk(id)
    .then(berita => {
      if (berita) {
        var page = berita
        Comment.findAll({ where: { newsid: id } })
          .then(data => {
            if (data) {
              res.json({
                pop: page,
                komentar: data
              });
            } else {
              res.json({
                pop: berita,
                komentar: data
              });
            }
          })
          .catch(err => {
            res.json({
              pop: berita,
              komentar: {}
            });
          });
      } else {
        // http 404 not found
        res.json({
          berita: berita,
          komentar: {}
        });
      }

    })
    .catch(err => {
      res.json({
        berita: {},
        komentar: {}
      });
    });
});

router.post('/comment/:id', function (req, res, next) {
  var id = parseInt(req.params.id)
  var komentar = {
    newsid: id,
    comment: req.body.comment
  }
  Comment.create(komentar)
    .then(data => {
      res.redirect("/newspage?id=" + " " + id)
    })
    .catch(err => {
      res.redirect("/")
    });

  //res.render('addproduct', { title: 'Add Product' });
});

//Addnews
router.post('/addnews', auth, function (req, res, next) {

  var dataBerita = {
    urlGambar: req.body.urlGambar,
    judulBerita: req.body.judulBerita,
    isiBerita1: req.body.isiBerita1,
    isiBerita2: req.body.isiBerita2,
    isiBerita3: req.body.isiBerita3
  }
  News.create(dataBerita)
    .then(data => {
      res.json({
        message: 'News Added'
      });
    })
    .catch(err => {
    });

  //res.render('addproduct', { title: 'Add Product' });
});



router.delete('/deleteberita/:id', auth, function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  News.destroy({
    where: { id: id }
  })
    .then(num => {
      res.redirect('/daftarberita');
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });

});

router.delete('/deletecomment/:id', function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  Comment.destroy({
    where: { id: id }
  })
    .then(num => {
      res.redirect("/");
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });

});


router.put('/editberita/:id', auth, function (req, res, next) {
  var id = parseInt(req.params.id); // /detail/2, /detail/3

  News.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      res.redirect('/daftarberita');

    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });

});

router.post('/register', function (req, res, next) {
  var hashpass = bcrypt.hashSync(req.body.password, 8);
  var user = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: hashpass
  }
  User.findOne({ where: { email: req.body.email } })
    .then(data => {
      if (data) {
        res.json({
          message: 'Email Already Registered'
        });
      } else {
        User.create(user)
          .then(data => {
            res.json({
              message: 'Registeration Successful'
            });
          }).catch(err => {
            res.json({
              message: 'Registeration Failed'
            });
          });
      }
    })
    .catch(err => {
      res.json({
        message: 'Registeration Failed'
      });
    });


  //res.render('addproduct', { title: 'Add Product' });
});


router.get('/error', function (req, res, next) {
  res.json({
    message: "Unauthorized"
  });
});

router.post('/login', function (req, res, next) {
  User.findOne({ where: { email: req.body.email } })
    .then(data => {
      console.log(loginValid);
      if (data) {
        var loginValid = bcrypt.compareSync(req.body.password, data.password);
        console.log(loginValid);
        if (loginValid) {

          // simpan session
          req.session.email = req.body.email;
          req.session.islogin = true;

          res.json({
            message: 'Login'
          });
        } else {
          res.json({
            message: 'Login Failed'
          });
        }
      } else {
        res.json({
          message: 'Login Failed'
        });
      }
    })
    .catch(err => {
      res.json({
        message: 'Login Failed'
      });
    });
});

router.delete('/logout', function (req, res, next) {
  req.session.destroy();
  res.json({
    message: 'Logout Success'
  });
});

module.exports = router;
