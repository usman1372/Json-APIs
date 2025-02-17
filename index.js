const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

//Create instance of express
const app = express();

//Properties
const Port = 8000;

//Middle ware
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  //prepare a log
  fs.appendFile("log.txt", `\n ${Date.now}: ${req.method}: ${req.path}`);
  next();
});

//Define Routes individually

//---Get Request---
//- 1 For mobile applications--
app.get("/api/users", (req, res) => {
  res.setHeaders("X-MyName", "Usman"); //"X at the start means custom header"
  console.log(req.header);
  return res.json(users);
});

//- 2 Get user by dynamic id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  return res.json(user);
});

//--For web applications--
app.get("/users", (req, res) => {
  const html = `<ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
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
app.post("/api/users", (req, res) => {
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
  return res.json({ status: "Pending" });
});

/*
Way to combine or Group similar route but with different 
Methods
*/

app
  .route("/users/:id")
  .patch((req, res) => {
    //TODO: Edit user
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //TODO: Delete user
    const id = Number(req.params.id);
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
    );
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
