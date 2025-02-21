const express = require("express");
const fs = require("fs");
//const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");
const { Console, timeStamp } = require("console");
const { json } = require("stream/consumers");

//Create instance of express
const app = express();
const Port = 8000;

//Connection to db
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("Mongoose db connected"))
  .catch((err) => console.log("Mongoose db connection Error", err));

//Schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      Type: String,
    },
  },
  { timestamps: true }
);

//Model
const User = mongoose.model("user", userSchema);

//Middle ware
app.use(express.urlencoded({ extended: false }));

/*
//Custom middle ware
app.use((req, res, next) => {
  //prepare a log
  fs.appendFile("log.txt", `\n ${Date.now}: ${req.method}: ${req.path}`);
  next();
});
*/

//Define Routes individually

//---Get Request---
//- 1 For mobile applications--
app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});
  res.setHeaders("X-MyName", "Usman"); //"X at the start means custom header"
  console.log(req.header);
  return res.json(allDBUsers);
});

//- 2 Get user by dynamic id
app.get("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(user);
});

//--For web applications--
app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `<ul>
    ${allDBUsers
      .map((user) => `<li>${user.firstName} - ${user.lastName} </li>`)
      .join("")}
    </ul>
    `;
  return res.send(html);
});

//---Post Request---
//- 1 For web
app.post("/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  console.log("Body:", body);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "Success", id: users.length });
  });
});

//- 2 For mobile
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.email ||
    !body.gender ||
    !body.job_title ||
    !body.last_name
  ) {
    res.status(400).json({ msg: "All Fields are required..." });
  }

  await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobtTitle: body.job_title,
  });

  return res.status(201).json({ status: "Success" });
});

/*
Way to combine or Group similar route but with different 
Methods
*/

app
  .route("/users/:id")
  .patch(async (req, res) => {
    //TODO: Edit user
    const user = await User.findByIdAndUpdate(req.params.id, {
      lastName: "Changed",
    });
    return res.json({ status: "Pending" });
  })
  .delete(async (req, res) => {
    //TODO: Delete user
    const id = Number(req.params.id);
    await User.findByIdAndDelete(id);
    /*
    const filterUsers = users.filter((user) => user.id !== id);
    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(filterUsers, null, 2),
      (err, data) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete user" });
        }
        res.json({ status: "Deleted Successfully", id: id });
      }
    );*/
    res.status(201).json({ success: "User deleted" });
  })
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    const html = `<ul>
        ${user.map((userObj) => `<li>${userObj.first_name}</li>`).join("")}
        </ul>
        `;
    return res.send(html);
  });

//Create server
app.listen(Port, () => console.log(`Server started at Port: ${Port}`));
