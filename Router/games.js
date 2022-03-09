const express = require("express");
const conn = require("../model/db");
const app = express();
const Router = express.Router();
var a;
var count = 0;
var score = 0;
Router.get('/cube', (req, res) => {
  conn.query('SELECT * FROM comments', function(err, rows, fields) {
    for(var i = 0; rows[i] != a; i++){
      count++;
      score += rows[i].rate;
    }
    console.log(count)
    if(req.session.loggedin){
      res.render('games/cube', {
        path: 'exit/logout',
        button: 'Logout',
        comment: '',
        ong: {rows},
        n: count,
        avg_score: Math.round(score / count * 100) / 100,
      });
    } else {
      res.render('games/cube', {
        path: 'exit/login',
        button: 'Login',
        comment: 'Login to leave a comment',
        ong: {rows},
        n: count,
        avg_score: Math.round(score / count * 100) / 100,
      });
      console.log()
    }
  })
  count = 0;
  score = 0;
})
Router.post('/cube/comment', (req, res) => {
  let today = new Date();
  var co = {
    name: req.cookies['names'],
    comment: req.body.comment,
    time: today.toLocaleDateString('en-US'),
    rate: req.body.rate
  }
  console.log(co.comment)

  var filtering = function(word){
    return co.comment.indexOf(word)
  }
  //console.log(filter.indexOf('씨'), filter.indexOf('병신'), filter.indexOf('장애'), filter.indexOf('좆'), filtering('fuck'))
  var name = req.cookies['names']
  console.log(co);
  //console.log(req.cookies['names'], req.body.comment, req.body.rate, today.toLocaleDateString('en-US'));
  if((filtering('fuck') + filtering('씨') + filtering('병신') + filtering('장애') + filtering('좆'))!= -5){
    console.log("o");
    res.write("<script>alert('Invalid word detected.')</script>");
    res.write("<script>window.location=\"/games/cube\"</script>");
  }
  conn.query('SELECT * FROM comments where name = ?', name, function(err, rows, fields){
    console.log("ong")
    if(rows.length <= 0){
      conn.query('INSERT INTO comments SET ?', co, function(err, rows, fields) {
        console.log(co);
        res.redirect('/games/cube');
      })
    } else {
      res.write("<script>alert('you have comment already')</script>");
      res.write("<script>window.location=\"/games/cube\"</script>");
    }
  })
})

Router.get('/exit/login', (req, res) => {
  res.redirect('/account/login');
})

Router.get('/exit/logout', (req, res) => {
  res.redirect('/account/logout');
})

/* Router.get('/cube', (req,res)=>{
  res.render('test');
}) */

/* Router.post('/cube/download', (req, res) => {
  res.send(200);
  res.redirect('/games/cube');
  res.setHeader('Content-Disposition', `attachment; filename=${test.txt}`); // 이게 핵심 
  res.sendFile('/app/test.txt');
  if(req.session.loggedin){
    res.download('/app/test.txt')
    res.redirect('/games/cube');
  } else {
    res.download('/app/test.txt')
    res.redirect('/games/cube');
  }
}) */

module.exports = Router;