var express          = require("express"),
    app              = express(),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require('method-override');
     
    
mongoose.connect("mongodb://localhost/Medical");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));

var Medi_schema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    created:  {type: Date, default: Date.now}
});

var Medicine =mongoose.model("Medicine", Medi_schema);

app.get("/", function(req, res){
    res.redirect("/medicine");
});


     
app.get("/medicine", function(req, res){
  Medicine.find({}, function(err, all_med){
        if(err){
            console.log(err);
        } else {
            res.render("index", {all_med :all_med}); 
        }
    })
});

app.get("/medicine/new", function(req, res){
   res.render("new"); 
});




app.post("/medicine", function(req, res){
    req.body.description = req.sanitize(req.body.description);
    var name  =  req.body.name;
    var image =  req.body.image;
    var desc  =  req.body.description;
    var formData = {name: name, image: image, description: desc }
    Medicine.create(formData, function(err, new_med){
       console.log(new_med);
      if(err){
          res.render("new");
      } else {
          res.redirect("/medicine");
      }
   });
});


app.get("/medicine/:id", function(req, res){
   Medicine.findById(req.params.id, function(err, smed){
      if(err){
          res.redirect("/");
      } else {
          res.render("show", {smed: smed});
      }
   });
});



app.get("/medicine/:id/edit", function(req, res){
   Medicine.findById(req.params.id, function(err, emed){
       if(err){
           console.log(err);
           res.redirect("/")
       } else {
           res.render("edit", {emed: emed});
       }
   });
});

app.put("/medicine/:id", function(req, res){
    var name =  req.body.name;
    var desc =  req.body.description;
    var formData = {name: name, description: desc }
   Medicine.findByIdAndUpdate(req.params.id, formData, function(err, emed){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/medicine/" + emed._id;
         res.redirect(showUrl);
       }
   });
});

app.delete("/medicine/:id", function(req, res){
   Medicine.findById(req.params.id, function(err, med){
       if(err){
           console.log(err);
       } else {
           med.remove();
           res.redirect("/medicine");
       }
   }); 
});


app.listen(process.env.PORT, process.env.IP);