const express=require("express");
const mongoose=require("mongoose");
const bodyParser= require("body-parser");
require('dotenv').config();
const URL = process.env.DATABASE_URL;

const mongoConnect=async function(){
	try{


	await mongoose.connect(URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('MongoDB is Connected...');
} catch(err) {
	 
  console.error(err);
  process.exit(1);
}
}
mongoConnect();


const collabShipSchema= new mongoose.Schema({
	projectName: String,
	type: String,
	date: Date

});


const signupsSchema= new mongoose.Schema({
	name: String,
	gitProfile: String

});

const boxes=mongoose.model("boxes",collabShipSchema );   //collections called nameEmail
var arr=[];


const signups=mongoose.model("signups",signupsSchema );   //collections called nameEmail
var signupsArr=[];



boxes.find(function(err,docs){ 
	if(err){
		console.log(err);
	} else{ 
		docs.forEach(function(doc){
			arr.push(doc.projectName) ;
		}); 
	} 
	console.log(arr);
// console.log(docs);
});



const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("Public"));

app.get("/", function(req,res){
	res.render("index" , {arr: arr});
});

app.get("/apply", function(req,res,html){
	res.sendFile(__dirname + "/Apply.html");
});


const postData= async function(){

// try{

	app.post("/apply", function(req,res){
		var userName= req.body.name;


		const user= new signups({
			name: req.body.name,
			gitProfile: req.body.gitProfile,
		});


const dataSave= async function(){
		await user.save(function(err){
			if(!err){
				res.render("welcome");
				console.log("successfully inserted to DB");
			}
			else{
				console.log(err);
				console.log("The err causing long time response from heroku hence causing H12 ");
			}
		});


}
dataSave();
	});
} 
postData();

// catch (err) {
// 	console.error(err);
// 	process.exit(1);
// }



let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}



app.listen(port, function(){

	console.log("server is running at port 8000");

});





