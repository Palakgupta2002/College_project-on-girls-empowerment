//This is where i can access a package
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
var enrollment1;
var email1;

//This is for mongoose connection
mongoose
  .connect("mongodb://127.0.0.1/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected succesfully");
  })
  .catch((err) => {
    console.log("error occurs", err);
  });
//This is for public Static
app.use(express.static(path.join(__dirname, "public")));

//This is for Server running
app.listen(5000, () => {
  console.log("server is running");
});
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//This is Landing Page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/view/landing/landing.html");
});
var db = mongoose.connection;
const collection = db.collection("users");

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

//This is for users
// app.post('/submit', (req, res) => {
//   var name = req.body.name;
//   var email = req.body.email;
//   var password = req.body.password;
//   var father=req.body.father;
//   var mother=req.body.mother;
//   var alternativeemail=req.body.alternativeemail;
//   var alternativemobile=req.body.alternativemobile;
//   var mobile=req.body.mobile;
//   var enrollment=req.body.enrollment;
//   var admissionyear=req.body.admissionyear;
//   var department=req.body.department;
//   var confirmpassword=req.body.confirmpassword;
//   var image=req.body.image;
//   const branch = req.body.branch;
//   enrollment1=req.body.enrollment;

//   // Check if user with the same email already exists
//   db.collection('users').findOne({ enrollment:enrollment,email:email }, (err, user) => {
//     if (err) {
//       console.log('Error occurred during user lookup:', err);
//       return res.status(500).send('Internal Server Error');
//     }

//     if (user) {
//       console.log('User with the same is already exists');
//       return res.status(400).send('<script>alert("User with the same credentials  is already exists please make sure your enrollment no. and email is your own"); window.location.href="/";</script>');
//     }

//     // If user doesn't exist, proceed with registration
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error('Error occurred while hashing password:', err);
//         return res.status(500).send('Internal Server Error');
//       }

//       var data = {
//         name: name,
//         email: email,
//         mobile:mobile,
//         password: hashedPassword, // Store the hashed password
//         father:father,
//         mother:mother,
//         alternativeemail:alternativeemail,
//         alternativemobile:alternativemobile,
//         enrollment:enrollment,
//         admissionyear:admissionyear,
//         department:department,
//         branch:branch ,
//         image:image,
//         confirmpassword:hashedPassword
//       };
//       console.log(password,confirmpassword);
//       if(password==confirmpassword){
//         db.collection('users').insertOne(data, (err, collection) => {
//           if (err) {
//             throw err;
//           }

//           console.log('Record Inserted Successfully', collection);
//           // res.redirect('/profile');

//           return res.sendFile(__dirname + '/view/homepage/homepage.html');
//         });
//       }
//       else{
//         return res.status(400).send('<script>alert("Make sure Password or Confirm password is match"); window.location.href="/";</script>');
//       }
//       console.log('Record Inserted Successfully', collection);
//       // return res.sendFile(__dirname + '/view/profile/profile.html');
//           return res.sendFile(__dirname + '/view/homepage/homepage.html');
//     });
//   });
// });

//for a login page
app.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var enrollment = req.body.enrollment;
  enrollment1 = req.body.enrollment;
  email1=req.body.email;

  var logindata = {
    email: email,
    enrollment: enrollment,
  };

  // Rest of the code...
  db.collection("users").findOne(logindata, (err, user) => {
    if (err) {
      console.log("Error occurred during login", err);
      return res.status(500).send("Internal Server error");
    }

    if (user) {
      // Compare the entered password with the hashed password stored in the user object
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error occurred while comparing passwords:", err);
          return res.status(500).send("Internal Server Error");
        }

        if (result) {
          module.exports = user;
          console.log("User authenticated", user);

          return res.sendFile(__dirname + "/view/homepage/homepage.html");
        } else {
          console.log("Invalid credentials");
          return res.status(401).send("Invalid credentials");
        }
      });
    } else {
      console.log("Invalid credentials");
      res.status(401).send("Invalid credentials");
    }
  });
});

//This is for profile
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.get("/profile", (req, res) => {
  db.collection("users").findOne({}, (err, user) => {
    if (err) {
      console.log("Error occurred while fetching user data:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      console.log("No user found");
      return res.status(404).send("User Not Found");
    }
    const filePath = path.join(__dirname, "/view/profile/profile.html");
    return res.sendFile(filePath);
  });
});

//This is for profiledata
app.get("/profileData", (req, res) => {
  db.collection("users").findOne({ enrollment: enrollment1 }, (err, user) => {
    if (err) {
      console.log("Error occurred while fetching user data:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      console.log("No user found");
      return res.status(404).send("User Not Found");
    }

    // Extract the user data and send it to the client
    const userData = {
      name: user.name,
      email: user.email,
      enrollment: user.enrollment,
      department: user.department,
      admissionyear: user.admissionyear,
      mobile: user.mobile,
      father: user.father,
      image: user.img.data,
      branch: user.branch,
      mother: user.mother,
    };

    res.json({ user: userData });
  });
});

//This is for homepage Api
app.get("/homepage", (req, res) => {
  fs.readFile(__dirname + "/view/homepage/homepage.html", (err, data) => {
    if (err) {
      console.log("Error Occured", err);
      return res.status(500).send("internal error");
    }
    res.sendFile(__dirname + "/view/homepage/homepage.html");
  });
});
app.get("/complainpage", (req, res) => {
  fs.readFile(__dirname + "/view/complain/complain.html", (err, data) => {
    if (err) {
      console.log("Error Occured", err);
      return res.status(500).send("internal error");
    }
    res.sendFile(__dirname + "/view/complain/complain.html");
  });
});
//This is for complain status
app.get("/complainstatus", (req, res) => {
  fs.readFile(
    __dirname + "/view/complainstatus.html/cmplnsts.html",
    (err, data) => {
      if (err) {
        console.log("Error occurs to fetch file");
        return res.status(500).send("internal error");
      }
      res.sendFile(__dirname + "/view/complainstatus.html/cmplnsts.html");
    }
  );
});

//This is for complain
app.post("/complain", (req, res) => {
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
    message: message,
  };

  // Generate a unique complaint ID
  var complaintId = generateUniqueId();

  // Add the complaint ID to the complaininfo object
  complaininfo.complaintId = complaintId;

  db.collection("complaininfo").insertOne(complaininfo, (err, collection) => {
    if (err) {
      throw err;
    }

    console.log("Record Inserted Successfully", complaininfo);

    var alertMessage =
      "Your complaint has been submitted successfully. Complaint ID: " +
      complaintId;
    return res
      .status(200)
      .send(
        '<script>alert("' +
          alertMessage +
          '"); window.location.href="/complainpage";</script>'
      );
  });
});
app.post("/complainstatus", (req, res) => {
  const complaintId = req.body.complaintId;
  const status = "Closed"; // Set the desired status value

  db.collection("complaininfo").updateOne(
    { complaintId: complaintId },
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error("Error occurred while updating status:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Status updated successfully");
      return res.status(201).send("Status updated successfully");
    }
  );
});

//api for complain data
app.get("/complaindata", (req, res) => {
  const enrollment = req.query.venrollment; // Get the enrollment number from the query parameters

  db.collection("complaininfo")
    .find({ venrollment: enrollment1 })
    .toArray()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err, "error at get complain data");
      res.status(500).send("Internal Server Error");
    });
});
//This is for admin
app.get("/complaindataadmn", (req, res) => {
  const enrollment = req.query.venrollment; // Get the enrollment number from the query parameters

  db.collection("complaininfo")
    .find()
    .toArray()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err, "error at get complain data");
      res.status(500).send("Internal Server Error");
    });
});
app.patch('/hiddenstatus', (req, res) => {
  const { complaintId, cstatus } = req.body;

  // Update the status in the MongoDB collection
  // Replace `YourModel` with the appropriate Mongoose model for your collection
  db.collection("complaininfo").findOneAndUpdate(
    { complaintId },
    { $set: { cstatus } },
    { new: true }
  )
    .then(updatedComplaint => {
      if (updatedComplaint) {
        res.status(200).json({ message: 'Status updated successfully' });
      } else {
        res.status(404).json({ message: 'Complaint not found' });
      }
    })
    .catch(error => {
      console.error('An error occurred while updating status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

//admin Api
app.get("/admindash", (req, res) => {
  fs.readFile(__dirname + "/view/admin/admin.html", (err, data) => {
    if (err) {
      console.log("Error Occured", err);
      return res.status(500).send("internal error");
    }
    res.sendFile(__dirname + "/view/admin/admin.html");
  });
});

//signup Api
app.get("/signup", (req, res) => {
  fs.readFile(__dirname + "/view/signup.html", (err, data) => {
    if (err) {
      console.log("Error Occured", err);
      return res.status(500).send("internal error");
    }
    res.sendFile(__dirname + "/view/signup.html");
  });
});

//Admin Login
app.post("/adminlogin", (req, res) => {
  var adminid = req.body.adminid;
  var adminemail = req.body.adminemail;
  var adminpassword = req.body.adminpassword;

  var alogindata = {
    adminid: adminid,
    adminemail: adminemail,
    adminpassword: adminpassword,
  };

  db.collection("admin").findOne(
    { id: adminid, email: adminemail },
    (err, admin) => {
      if (err) {
        console.log("Error occurred during login", err);
        return res.status(500).send("Internal Server error");
      }

      if (admin) {
        // Compare the entered password with the hashed password stored in the admin object
        if (alogindata.adminpassword == admin.password) {
          // User authenticated
          res
            .status(200)
            .sendFile(__dirname + "/view/admin/adminhomepage.html");
        } else {
          // Incorrect password
          res.status(401).send("Invalid password");
        }
      }
    }
  );
});
//THis is for feedback Data
app.post("/feedback", (req, res) => {
  const fid = req.body.complaintId;
  const fenrollment = enrollment1;
  const fname = req.body.fname;
  const fmobile = req.body.fmobile;
  const faddress = req.body.faddress;
  const fmsg = req.body.fmsg;

  var feedback = {
    fid: fid,
    fname: fname,
    fmobile: fmobile,
    faddress: faddress,
    fmsg: fmsg,
    fenrollment: fenrollment,
  };

  db.collection("feedback").insertOne(feedback, (err, result) => {
    if (err) {
      console.log("An error occurred while inserting the feedback:", err);
      return res.status(500).send("Error occurred while submitting feedback");
    }

    console.log("Feedback submitted successfully");
    var alertMessage = " Your Feedback succesfully send admin";
    return res
      .status(200)
      .send(
        '<script>alert("' +
          alertMessage +
          '"); window.location.href="/complainstatus";</script>'
      );
  });
});
//This is for feedback to send admin
app.get("/feedbackadmin", (req, res) => {
  db.collection("feedback")
    .find()
    .toArray()
    .then((response) => {
      console.log("Feedback Shows");
      res.send(response);
    })
    .catch((err) => {
      console.log(err, "Error occures to inserted");
      res.status(500).send("error occurs");
    });
});

//This is a functions to update status
app.post("/approved", (req, res) => {
  const complaintId = req.body.complaintId;
  const status = "Approved"; // Set the desired status value

  db.collection("complaininfo").updateOne(
    { complaintId: complaintId },
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error("Error occurred while updating status:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Status updated successfully");
      return res.status(201).send("Status updated successfully");
    }
  );
});
app.post("/process", (req, res) => {
  const complaintId = req.body.complaintId; // Retrieve the complaintId from the request body or query parameters
  const status = "Process"; // Set the desired status value

  db.collection("complaininfo").updateMany(
    { complaintId: complaintId }, // Use the complaintId in the query to filter documents
    {
      $set: {
        cstatus: status,
      },
    },
    (err, result) => {
      if (err) {
        console.error("Error occurred while updating status:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Status updated successfully");
      return res.status(201).send("Status updated successfully");
    }
  );
});
app.post("/solved", (req, res) => {
  const complaintId = req.body.complaintId; // Retrieve the complaintId from the request body or query parameters
  const status = "Solved"; // Set the desired status value

  db.collection("complaininfo").updateMany(
    { complaintId: complaintId }, // Use the complaintId in the query to filter documents
    { $set: { cstatus: status } },
    (err, result) => {
      if (err) {
        console.error("Error occurred while updating status:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Status updated successfully");
      return res.status(201).send("Status updated successfully");
    }
  );
});

app.post("/deletecmpln", (req, res) => {
  const complaintId = req.body.complaintId; // Retrieve the complaintId from the request body or query parameters

  db.collection("complaininfo").deleteOne(
    { complaintId: complaintId }, // Use the complaintId in the query to filter documents
    (err, result) => {
      if (err) {
        console.error("Error occurred while deleting complaint:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Record deleted successfully");
      return res.status(201).send("Delete Record successfully");
    }
  );
});

//This is for update your profile

// Function to generate a unique ID
function generateUniqueId() {
  // Generate a random numeric ID with 12 characters
  var uniqueId = "";
  var characters = "0123456789";
  var length = 12;

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }

  return uniqueId;
}
//function for add image
app.get("/status", (req, res) => {
  const complaintId = req.query.complaintId; // Retrieve the complaintId from the query parameters

  // Assuming you have a database query to retrieve the status based on the complaintId
  // Replace this with your actual implementation
  db.collection("complaininfo").findOne(
    { complaintId: complaintId },
    (err, result) => {
      if (err) {
        console.error("Error occurred while retrieving status:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (!result) {
        return res.status(404).send("Status not found");
      }

      const status = result.status; // Assuming the status is stored in the "cstatus" field
      return res.status(200).json({ status });
    }
  );
});

app.post("/updateProfile", (req, res) => {
  const {
    enrollment,
    father,
    mother,
    admissionyear,
    branch,
    email,
    department,
    mobile,
  } = req.body;
  db.collection("users").findOneAndUpdate(
    { enrollment: enrollment },
    {
      $set: {
        father,
        mother,
        admissionyear,
        branch,
        email,
        department,
        mobile,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error("Error updating profile:", err);
        res.json({ success: false });
      } else {
        console.log("Profile updated successfully");
        res.json({ success: true });
      }
    }
  );
});
var UserSignup = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  father: String,
  mother: String,
  alternativeemail: String,
  alternativemobile: Number,
  mobile: Number,
  enrollment: String,
  admissionyear: String,
  department: String,
  confirmpassword: String,
  branch:String,
  img: {
    data: Buffer,
    contentType: String,
  },
});
mongoose.model("users", UserSignup);
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });
app.post("/submit", upload.single("image"), (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var father = req.body.father;
  var mother = req.body.mother;
  var alternativeemail = req.body.alternativeemail;
  var alternativemobile = req.body.alternativemobile;
  var mobile = req.body.mobile;
  var enrollment = req.body.enrollment;
  var admissionyear = req.body.admissionyear;
  var department = req.body.admissionyear;
  var confirmpassword = req.body.confirmpassword;
  var image = req.body.image;
  const branch = req.body.branch;
  enrollment1 = req.body.enrollment;

  // Check if user with the same email already exists
  db.collection("users").findOne(
    { enrollment: enrollment, email: email },
    (err, user) => {
      if (err) {
        console.log("Error occurred during user lookup:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (user) {
        console.log("User with the same is already exists");
        return res
          .status(400)
          .send(
            '<script>alert("User with the same credentials  is already exists please make sure your enrollment no. and email is your own"); window.location.href="/";</script>'
          );
      }
      // If user doesn't exist, proceed with registration
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error occurred while hashing password:", err);
          return res.status(500).send("Internal Server Error");
        }

        var data = {
          name: name,
          email: email,
          mobile: mobile,
          password: hashedPassword, // Store the hashed password
          father: father,
          mother: mother,
          alternativeemail: alternativeemail,
          alternativemobile: alternativemobile,
          enrollment: enrollment,
          admissionyear: admissionyear,
          department: department,
          branch: branch,
          img: {
            data: fs.readFileSync(
              path.join(__dirname + "/uploads/" + req.file.filename)
            ),
            contentType: "image/png",
          },
          confirmpassword: hashedPassword,
        };
        
        if (password == confirmpassword || data.img) {
          mongoose
            .model("users", UserSignup)
            .create(data)
            .then((err, item) => {
              if (err) {
                console.log(err);
              } else {
                // item.save();
                res.redirect("/");
              }
            });
        } else {
          return res
            .status(400)
            .send(
              '<script>alert("Make sure Password or Confirm password is match"); window.location.href="/homepage";</script>'
            );
        }
      
        console.log("Record Inserted Successfully", collection);

        return res.sendFile(__dirname + "/view/homepage/homepage.html");
      });
    }
  );
});
