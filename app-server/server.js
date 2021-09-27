const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const UserRegitration =require('./model/RegistrationSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const hbs = require('hbs')

//scret Key for JWT joken generation
const JWT_SECRET = 'somerandomKeyto@@#~~@#%'
var token = null
let username = null;
//Dd connection
const url ="mongodb+srv://max:<password>@cluster0.r0q11.mongodb.net/sample_registration?retryWrites=true&w=majority"
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})


const viewPaths = path.join(__dirname, "../app-server/templates/views")
const particalsPaths = path.join(__dirname, "../app-server/templates/partials")

//initilizing server
const app = express()
//view Engine Setup
app.set("view engine", "hbs")
app.set("views", viewPaths)
hbs.registerPartials(particalsPaths)
app.use(express.static('./public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 //welcome page(index page)
 app.get('/', (req, res) => {
    res.render("welcome", {
        title: "Welcome Page",
      });
  });

//Login page rendering
app.get('/api/login', (req, res) => {
    res.render("login", {
      title: "Login Page",
    });
  });

//Loginfailure page rendering  
app.get('/api/failpage', (req, res) => {
      return res.render("failpage", {
      title: "Failure Page",
    });
  });

//success page rendering  
app.get('/api/success', (req, res) => {
	return res.render("success", {
	title: "Login Success",
	tokenkey: token
  });
});

  
//registration page rendering
app.get('/api/reg', (req, res) => {
    res.render("registration", {
      title: "Registration Page",
    });
  });

//get all records 
app.get('/api/getall', function(req,res) {
	UserRegitration.find({} , (err,doc)=>{
	console.log(doc)
	  if(err!=null){
		 console.log(err)
	   }else{ 
		  return res.send(doc);
	   }
})
})


app.get('/api/getusername', async(req,res)=>{
	const user = await UserRegitration.findOne({ username }).lean()
	if(!user){
       return res.redirect(`failpage`)
	}else{
		return res.json({data: user, tokenkey:token})
	}
})

//Action for login User
debugger
app.post('/api/login', async (req, res) => {
	username = req.body.username
	const passwordinput  = req.body.passwordinput
	const user = await UserRegitration.findOne({ username }).lean()
    console.log(username,passwordinput)
    
	if (!user) {
		return res.redirect(`failpage`)
	}
	if (await bcrypt.compare(passwordinput, user.password)) {
		// the username, password combination is successful
		token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		return res.redirect('success')
	}
	return res.redirect(`failpage`)
})

//Save Action For UserRegistration
app.post('/api/register', async (req, res) => {
	const username =  req.body.username
	const passwordinput = req.body.passwordinput
	const age = req.body.userage
	const phone = req.body.userphone 
	const email = req.body.useremail  

    //backend Validation
	console.log(username,passwordinput, age,phone,email)
	if (!username || typeof username !== 'string') {
		console.log(username)
		return res.json({ status: 'error', error: 'Invalid username' })
	}
	if (!passwordinput || typeof passwordinput !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	} 
    if (!phone || typeof phone === 'undefined') {
		return res.json({ status: 'error', error: 'Invalid Phone Number' })
	}
    if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid Email' })
	}

	if (passwordinput.length < 8) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}
    //encrypt password
	const password = await bcrypt.hash(passwordinput, 7)
	const role = "user"

    const count = await UserRegitration.count({})
	if(count === 0){
       role = "admin"
	}
	try {
		const response = await UserRegitration.create({
			username,
			password,
            age,
            phone,
            email,
			role
		})
		   console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' , message: 'User Registered' })
})


//starting server
app.listen(3000, () => {
	console.log('Server up at 3000')
})