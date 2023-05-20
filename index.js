//This is where i can access a package
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
const multer=require("multer");
const { Admin } = require('mongodb');
const app = express()
var enrollment1;
var status;

//This is for mongoose connection
mongoose
  .connect(
    'mongodb://127.0.0.1/users',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    console.log('connected succesfully')
  })
  .catch((err) => {
    console.log('error occurs', err)
  })
  //This is for public Static
  app.use(express.static(path.join(__dirname, 'public')));

  //This is for Server running
app.listen(5000, () => {
  console.log('server is running')
})
app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)


//This is Landing Page
app.get('/', function (req, res) {
  
 res.sendFile(__dirname + '/view/landing/landing.html')

})
var db = mongoose.connection
 const collection = db.collection('users');

db.on('error', () => console.log('Error in Connecting to Database'))
db.once('open', () => console.log('Connected to Database'))


//This is for users
app.post('/submit', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var father=req.body.father;
  var mother=req.body.mother;
  var alternativeemail=req.body.alternativeemail;
  var alternativemobile=req.body.alternativemobile;
  var mobile=req.body.mobile;
  var enrollment=req.body.enrollment;
  var admissionyear=req.body.admissionyear;
  var department=req.body.admissionyear;
  var confirmpassword=req.body.confirmpassword;
  var image=req.body.image;
  const Branch = req.body.Branch;
  enrollment1=req.body.enrollment;

  // Check if user with the same email already exists
  db.collection('users').findOne({ enrollment:enrollment,email:email }, (err, user) => {
    if (err) {
      console.log('Error occurred during user lookup:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (user) {
      console.log('User with the same is already exists');
      return res.status(400).send('<script>alert("User with the same credentials  is already exists please make sure your enrollment no. and email is your own"); window.location.href="/";</script>');
    }

    // If user doesn't exist, proceed with registration
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error occurred while hashing password:', err);
        return res.status(500).send('Internal Server Error');
      }

      var data = {
        name: name,
        email: email,
        mobile:mobile,
        password: hashedPassword, // Store the hashed password
        father:father,
        mother:mother,
        alternativeemail:alternativeemail,
        alternativemobile:alternativemobile,
        enrollment:enrollment,
        admissionyear:admissionyear,
        department:department,
        Branch:Branch ,
        image:image,
        confirmpassword:hashedPassword
      };
      console.log(password,confirmpassword);
      if(password==confirmpassword){
        db.collection('users').insertOne(data, (err, collection) => {
          if (err) {
            throw err;
          }
  
          console.log('Record Inserted Successfully', collection);
          // res.redirect('/profile');
       
          return res.sendFile(__dirname + '/view/homepage/homepage.html');
        });
      }
      else{
        return res.status(400).send('<script>alert("Make sure Password or Confirm password is match"); window.location.href="/";</script>');
      } 
      console.log('Record Inserted Successfully', collection);
      // return res.sendFile(__dirname + '/view/profile/profile.html');
          return res.sendFile(__dirname + '/view/homepage/homepage.html');
    });
  });
});




//for a login page
app.post('/login', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var enrollment=req.body.enrollment
  enrollment1=req.body.enrollment;

  var logindata = {
    email: email,
    enrollment:enrollment,
  };

  // Rest of the code...
  db.collection('users').findOne(logindata, (err, user) => {
    if (err) {
      console.log('Error occurred during login', err);
      return res.status(500).send('Internal Server error');
    }

    if (user) {
      // Compare the entered password with the hashed password stored in the user object
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error occurred while comparing passwords:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (result) {
          module.exports=user;
            console.log('User authenticated', user);
        
          return res.sendFile(__dirname + '/view/homepage/homepage.html');
        } else {
          console.log('Invalid credentials');
          return res.status(401).send('Invalid credentials');
        }
      });
    } else {
      console.log('Invalid credentials');
      res.status(401).send('Invalid credentials');
    }
  });
});



//This is for profile
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.get('/profile', (req, res) => {
  db.collection('users').findOne({}, (err, user) => {
    if (err) {
      console.log('Error occurred while fetching user data:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (!user) {
      console.log('No user found');
      return res.status(404).send('User Not Found');
    }
    const filePath = path.join(__dirname, '/view/profile/profile.html');
    return res.sendFile(filePath);
  });
});



//This is for profiledata 
app.get('/profileData', (req, res) => {
  db.collection('users').findOne({enrollment:enrollment1}, (err, user) => {
    if (err) {
      console.log('Error occurred while fetching user data:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (!user) {
      console.log('No user found');
      return res.status(404).send('User Not Found');
    }

    // Extract the user data and send it to the client
    const userData = {
      name: user.name,
      enrollment: user.enrollment,
      department: user.department,
      admissionyear: user.admissionyear,
      mobile: user.mobile,
      father: user.father,
      image:user.image,
      Branch:user.Branch,
      mother:user.mother,
    };
    
     res.json({ user: userData });
  });
});



//This is for homepage Api
app.get('/homepage',(req,res)=>{
  fs.readFile(__dirname+'/view/homepage/homepage.html',(err,data)=>{
    if(err){
      console.log("Error Occured",err)
      return res.status(500).send('internal error');
    }
    res.sendFile(__dirname+'/view/homepage/homepage.html');
 })
})
app.get('/complainpage',(req,res)=>{
  fs.readFile(__dirname+'/view/complain/complain.html',(err,data)=>{
    if(err){
      console.log("Error Occured",err)
      return res.status(500).send('internal error');
    }
    res.sendFile(__dirname+'/view/complain/complain.html');
 })
})
//This is for complain status
app.get('/complainstatus',(req,res)=>{
  fs.readFile(__dirname+'/view/complainstatus.html/cmplnsts.html',(err,data)=>{
    if(err){
      console.log("Error occurs to fetch file");
      return res.status(500).send('internal error');
    }
    res.sendFile(__dirname+'/view/complainstatus.html/cmplnsts.html');
  })
})


//This is for complain
app.post('/complain', (req, res) => {
  var venrollment = req.body.venrollment;
  var vmobile = req.body.vmobile;
  var aname = req.body.aname;
  var abranch = req.body.abranch;
  var adepartment = req.body.adepartment;
  var idate = req.body.idate;
  var ctype = req.body.ctype;
  var cdate = req.body.cdate;
  var message = req.body.message;

  var complaininfo = {
    venrollment: venrollment,
    vmobile: vmobile,
    aname: aname,
    abranch: abranch,
    adepartment: adepartment,
    idate: idate,
    ctype: ctype,
    cdate: cdate,
    message: message
  };

  // Generate a unique complaint ID
  var complaintId = generateUniqueId();
   
   // Add the complaint ID to the complaininfo object
   complaininfo.complaintId = complaintId;


  db.collection('complaininfo').insertOne(complaininfo, (err, collection) => {
    if (err) {
      throw err;
    }

    console.log('Record Inserted Successfully', complaininfo);
    
    var alertMessage = 'Your complaint has been submitted successfully. Complaint ID: ' + complaintId;
    return res.status(200).send('<script>alert("' + alertMessage + '"); window.location.href="/complainpage";</script>');
  });

});

//api for complain data
app.get('/complaindata', (req, res) => {
  const enrollment = req.query.venrollment; // Get the enrollment number from the query parameters
  
  db.collection('complaininfo')
    .find({ venrollment: enrollment1 })
    .toArray()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err, 'error at get complain data');
      res.status(500).send('Internal Server Error');
    });
});
//This is for admin
app.get('/complaindataadmn', (req, res) => {
  const enrollment = req.query.venrollment; // Get the enrollment number from the query parameters
  
  db.collection('complaininfo')
    .find()
    .toArray()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err, 'error at get complain data');
      res.status(500).send('Internal Server Error');
    });
});
   


//admin Api
app.get('/admindash',(req,res)=>{
  fs.readFile(__dirname+'/view/admin/admin.html',(err,data)=>{
    if(err){
      console.log("Error Occured",err)
      return res.status(500).send('internal error');
    }
    res.sendFile(__dirname+'/view/admin/admin.html');
 })
})


//signup Api
app.get('/signup',(req,res)=>{
  fs.readFile(__dirname+'/view/signup.html',(err,data)=>{
    if(err){
      console.log("Error Occured",err)
      return res.status(500).send('internal error');
    }
    res.sendFile(__dirname+'/view/signup.html');
 })
})


//Admin Login
app.post('/adminlogin', (req, res) => {
  var adminid = req.body.adminid;
  var adminemail = req.body.adminemail;
  var adminpassword = req.body.adminpassword;

  var alogindata = {
    adminid: adminid,
    adminemail: adminemail,
    adminpassword: adminpassword
  };

  db.collection('admin').findOne({ id: adminid, email: adminemail }, (err, admin) => {
    if (err) {
      console.log('Error occurred during login', err);
      return res.status(500).send('Internal Server error');
    }

    if (admin) {
      // Compare the entered password with the hashed password stored in the admin object
      if (alogindata.adminpassword == admin.password) {
        // User authenticated
        res.status(200).sendFile(__dirname+'/view/admin/adminhomepage.html');
      
      } else {
        // Incorrect password
        res.status(401).send('Invalid password');
      }
    } 
    
  });
});

//This is a functions to update status
app.post('/approved', (req, res) => {
  const complaintId = req.body.complaintId;
  const status = '30%'; // Set the desired status value

  db.collection('complaininfo').updateOne(
    {complaintId: complaintId},
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error('Error occurred while updating status:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Status updated successfully');
      return res.status(201).send('Status updated successfully');
    }
  );
});
app.post('/process', (req, res) => {
  const complaintId = req.body.complaintId; // Retrieve the complaintId from the request body or query parameters
  const status = '60%'; // Set the desired status value

  db.collection('complaininfo').updateMany(
    { complaintId: complaintId }, // Use the complaintId in the query to filter documents
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error('Error occurred while updating status:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Status updated successfully');
      return res.status(201).send('Status updated successfully');
    }
  );
});
app.post('/solved', (req, res) => {
  const complaintId = req.body.complaintId; // Retrieve the complaintId from the request body or query parameters
  const status = '100%'; // Set the desired status value

  db.collection('complaininfo').updateMany(
    { complaintId: complaintId }, // Use the complaintId in the query to filter documents
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error('Error occurred while updating status:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Status updated successfully');
      return res.status(201).send('Status updated successfully');
    }
  );
});









    

// Function to generate a unique ID
function generateUniqueId() {
  // Generate a random numeric ID with 12 characters
  var uniqueId = '';
  var characters = '0123456789';
  var length = 12;

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }

  return uniqueId;
}
 //function for add image
 

