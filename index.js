const express = require("express");
const users = require("./MOCK_DATA.json");

//Create instance of express
const app = express();

//Properties
const Port = 8000;

//Define Routes
//---Get Request---

//For mobile applications
app.get("api/users", (req, res) => {
  return res.json(users);
});

//For web applications
app.get("/users", (req, res) => {
  const html = `<ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

//---Post Request---

//Create server
app.listen(Port, () => console.log(`Server started at Port: ${Port}`));
