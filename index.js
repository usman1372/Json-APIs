const express = require("express");
const users = require("./MOCK_DATA.json");

//Create instance of express
const app = express();

//Properties
const Port = 8000;

//Define Routes individually
//---Get Request---

//--For mobile applications--
app.get("/api/users", (req, res) => {
  return res.json(users);
});

//Get user by dynamic id
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
app.post("/users", (req, res) => {
  //TODO: Create new user
  return res.json({ Status: Pending });
});

/*
Way to combine or Group similar route but with different 
Methods
*/

app
  .route("/users:id")
  .patch((req, res) => {
    //TODO: Edit user
    return res.json({ Status: Pending });
  })
  .delete((req, res) => {
    //TODO: Delete user
    return res.json({ Status: Pending });
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
