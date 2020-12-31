const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://apiuser:abcd1234@cluster0.ygmxs.mongodb.net/mongoclass?retryWrites=true&w=majority')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();
const Coach = require('./coachSchema');
router.get('/', (req,res)=>{
	res.json({message:'Hooray! welcome to my API!'});
})

app.use('/api',router);

router.get('/coaches', (req,res)=>{
	Coach.find((err,coaches)=>{
		if (err){
			res.send(err);
		}
		else {
			res.json(coaches);
		}
	})
});

router.post('/coaches', (req,res)=>{
	var coach = new Coach();
	coach.home = req.body.name;
	coach.email = req.body.email;
	coach.phoneNumber = req.body.phoneNumber;
	coach.picUrl = req.body.picUrl;
	coach.specialities = req.body.specialities;
	coach.location = req.body.location;

	coach.save((err)=>{
		if(err) res.send(err);
		res.json({message:'Coach created!'});
	})
})

router.get('/coaches/:id', (req,res)=>{
	Coach.findById(req.params.id, (err,coach)=>{
		if (err) res.send(err);
		res.json(coach);
	})
})

router.post('/coaches/:id', (req,res)=>{
	Coach.findById(req.params.id, (err,coach)=>{
		if (err) res.send(err);
		coach.home = req.body.name;
		coach.email = req.body.email;
		coach.phoneNumber = req.body.phoneNumber;
		coach.picUrl = req.body.picUrl;
		coach.specialities = req.body.specialities;
		coach.location = req.body.location;
		coach.save((err)=>{
			if (err) res.send(err);
			res.json({message:'Coach updated!'});
		})
	})
})

router.post('/coaches/:id/sessions', (req,res)=>{
	Coach.findById(req.params.id, (err,coach)=>{
		if (err) res.send(err);
		var newSession = {
			title: req.body.title,
			posterUrl:req.body.posterUrl,
			description:req.body.description,
			tags:req.body.tags,
			type:req.body.type,
			level:req.body.level,
			states:req.body.states,
			areas:req.body.areas,
			address:req.body.address,
			price:req.body.price
		}
		coach.sessions.push(newSession);
		coach.save(err=>{
			if (err) res.send(err);
			res.json({message:"New Session added"})
		})
	})
})
app.listen(port);

console.log('Magic happns on port '+port);
