require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
mongoose.connect(process.env.MONGO_URI,{}).catch(err => console.error('MongoDB connection error:', err));
const app = express();
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user,done)=>done(null,user._id));
passport.deserializeUser(async (id,done)=>{ const u = await User.findById(id); done(null,u); });
passport.use(new GoogleStrategy({clientID:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,callbackURL:`http://localhost:5001/auth/google/callback`},async (accessToken,refreshToken,profile,done)=>{
  let u = await User.findOne({providerId:profile.id,provider:'google'});
  if(!u) u = await User.create({providerId:profile.id,provider:'google',displayName:profile.displayName,email:(profile.emails&&profile.emails[0]&&profile.emails[0].value)||''});
  done(null,u);
}));
passport.use(new GitHubStrategy({clientID:process.env.GITHUB_CLIENT_ID,clientSecret:process.env.GITHUB_CLIENT_SECRET,callbackURL:`http://localhost:5001/auth/github/callback`},async (accessToken,refreshToken,profile,done)=>{
  let u = await User.findOne({providerId:profile.id,provider:'github'});
  if(!u) u = await User.create({providerId:profile.id,provider:'github',displayName:profile.displayName||profile.username,email:(profile.emails&&profile.emails[0]&&profile.emails[0].value)||''});
  done(null,u);
}));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.listen(process.env.PORT||5000);
