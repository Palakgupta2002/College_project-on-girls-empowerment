const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
const app = express()
var enrollment1;
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
  app.use(express.static(path.join(__dirname, 'public')));
app.listen(5000, () => {
  console.log('server is running')
})
app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/view/signup.html')
})
var db = mongoose.connection
 const collection = db.collection('users');

db.on('error', () => console.log('Error in Connecting to Database'))
db.once('open', () => console.log('Connected to Database'))



app.post('/submit', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var fathername=req.body.fathername;
  var mothername=req.body.mothername;
  var alternativeemail=req.body.alternativeemail;
  var alternativemobile=req.body.alternativemobile;
  var mobile=req.body.mobile;
  var enrollment=req.body.enrollment;
  var admissionyear=req.body.admissionyear;
  var department=req.body.admissionyear;
  var confirmpassword=req.body.confirmpassword;
  enrollment1=req.body.enrollment;
  // Check if user with the same email already exists
  db.collection('users').findOne({ enrollment:enrollment }, (err, user) => {
    if (err) {
      console.log('Error occurred during user lookup:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (user) {
      console.log('User with the same enrollment Number is already exists');
      return res.status(400).send('<script>alert("User with the same enrollment Number is already exists"); window.location.href="/";</script>');
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
        fathername:fathername,
        mothername:mothername,
        alternativeemail:alternativeemail,
        alternativemobile:alternativemobile,
        enrollment:enrollment,
        admissionyear:admissionyear,
        department:department,
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
          res
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



//for a lgin page
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
    };
    var inputImage = document.getElementById("input");

    // Assuming `addImage()` is a function that retrieves the uploaded image data
    var imageData = addImage();
    
    userData.inputimage = imageData;

    res.json({ user: userData });
  });
});

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
 

