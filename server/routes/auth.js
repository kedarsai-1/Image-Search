const express = require('express');
const passport = require('passport');
const router = express.Router();
router.get('/google', passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback', passport.authenticate('google',{failureRedirect:'/auth/fail'}), (req,res)=>res.redirect(process.env.FRONTEND_URL));
router.get('/github', passport.authenticate('github',{scope:['user:email']}));
router.get('/github/callback', passport.authenticate('github',{failureRedirect:'/auth/fail'}), (req,res)=>res.redirect(process.env.FRONTEND_URL));

router.get('/user', (req,res)=>{ if(req.user) return res.json({user:req.user}); res.status(401).json({user:null});});
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(process.env.FRONTEND_URL);
    });
  });
});
router.get('/fail', (req,res)=>res.status(401).send('auth failed'));
module.exports = router;
