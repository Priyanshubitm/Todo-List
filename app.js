const express= require("express");
const bodyParser= require("body-parser");
const mongoose = require('mongoose');
var _ = require('lodash');

var item=["eating"];
var wrokItem=["eating","coding","gym"];

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://admin-priyanshu:sa445948@cluster0.iwpnwpa.mongodb.net/todolistDB");

const todolistSchema = new mongoose.Schema({
    todotask:String
})

const Taskitem= mongoose.model("Taskitem",todolistSchema);

const Taskitem1= new Taskitem({
    todotask:"Welcome to Your ToDoList!"
})

const Taskitem2= new Taskitem({
    todotask:"Hit + to save an item!"
})

const Taskitem3= new Taskitem({
    todotask:"<-- Hit this to delete an item!"
})

const TaskitemList=[Taskitem1,Taskitem2,Taskitem3];

// Taskitem.insertMany(TaskitemList,function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Tasks Successfully added!")
//     }
// })
var day;
var stringDay;

const listSchema = {
    name: String,
    items:[todolistSchema]
}

const List= mongoose.model("List",listSchema);

app.get("/",function(req,res){
    // res.write("hemlu gaiz");
    
//    var today=new Date();
//     var options = { 
//         weekday: 'long', 
//         year: 'numeric',
//         month: 'long', 
//         day: 'numeric' 
//     };
    // var currentDay=today.getDay();
    // day= today.toLocaleDateString("en-US",options);
    // stringDay=day.toString();
    // console.log(day);
    // console.log(stringDay);


    Taskitem.find(function (err,taskitems) {
        if(taskitems.length === 0){
            Taskitem.insertMany(TaskitemList,function(err){
                if(err){
                     console.log(err);
                }else{
                    console.log("Tasks Successfully added!")
                }
        });
        res.redirect("/");
        }else{
            res.render("list", {listTitle : "Today",newTask1 : taskitems})
        }   
      })
    
})  


app.post("/",function(req,res){
    var currentitem=req.body.newItem; 
    var listName=req.body.list;

    const newTaskitem= new Taskitem({
        todotask:currentitem
    })

    if(listName==="Today"){
        newTaskitem.save();
        res.redirect("/");
    }else {
        List.findOne({name:listName},function(err,foundList) {
            foundList.items.push(newTaskitem);
            foundList.save();
            res.redirect("/"+listName); 
        })
    }
   
})

app.post("/delete",function(req,res){
   const checkedItem=req.body.checkbox;
   const listName=req.body.listName;
   console.log(listName);
   if(listName==="Today"){
    Taskitem.deleteOne({_id:checkedItem},function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("done and dusted");
            res.redirect("/")
        }
    })
       }else{
        List.findOneAndUpdate({name:listName},{$pull :{items :{_id:checkedItem}}},function(err,foundList) {
            if(!err){
                res.redirect("/"+listName);
            }
        })
       }
  
})

app.get('/:customListName',(req,res)=>{
    let requestedTitle=req.params.customListName;
    requestedTitle=_.lowerCase(requestedTitle);
    List.findOne({name:requestedTitle},function(err,foundList) {
        if(!err){
            if(!foundList){
                const list= new List({
                    name:requestedTitle,
                    items:TaskitemList
                })
                list.save();
                res.redirect("/"+requestedTitle);
            }else{
                res.render("list",{listTitle:foundList.name,newTask1 : foundList.items})
            }
        }
    })
  })

app.get("/about",function(req,res){
    res.render("about");
})

app.get("/work" , function(req,res){
    res.render("list",{listTitle:"Work list", newTask1 : wrokItem}); 
})

app.listen(3000,function(){
    console.log("server started at 3000");
})

// Taskitem.deleteMany(,function (err) {
//   if(err){
//     console.log(err);
//   }  else{
//     console.log("done and dusted");
//   }
// })