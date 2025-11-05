const fetch = require('node-fetch');
const express = require('express');
const Search = require('../models/Search');
const User = require('../models/User');
const router = express.Router();
function ensure(req,res,next){ if(req.user) return next(); res.status(401).json({error:'unauth'}); }
router.post('/search', ensure, async (req,res)=>{
  const term = req.body.term;
  const userId = req.user._id;
  if(!term) return res.status(400).json({error:'term required'});
  await Search.create({userId,term});
  const perPage = 30;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=${perPage}`;
  const r = await fetch(url,{headers:{Authorization:`Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`}}); 
  const data = await r.json();
  res.json({term, total:data.total, results:data.results});
});
router.get('/top-searches', async (req,res)=>{
  const agg = await Search.aggregate([
    { $group: { _id: "$term", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json(agg.map(a=>({term:a._id,count:a.count})));
});
router.get('/history', ensure, async (req,res)=>{
  const userId = req.user._id;
  const history = await Search.find({userId}).sort({timestamp:-1}).limit(50);
  res.json(history);
});
module.exports = router;
