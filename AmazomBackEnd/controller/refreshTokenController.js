/*const userDB = {
  user: require("../model/users.json"),
  setUsers: (data) => {
    this.user = data;
  },
};*/
const User = require("../model/User");
const Employee = require("../model/Employee");


const jwt = require("jsonwebtoken");
require("dotenv").config;

const handleRefreshToken = async(req, res) => {
  const cookies = req.cookies;
  console.log("Request body:", req.body);
  if (!cookies?.jwt) return res.status(401);

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;
  /*const foundUser = userDB.user.find(
    (person) => person.refreshToken === refreshToken
  );*/
  const foundEmployee = await Employee.findOne({ refreshToken }).exec();
  const foundUser = foundEmployee || await User.findOne({ refreshToken }).exec()
  console.log("Found user:", foundUser);
  if (!foundUser) return res.sendStatus(403);


  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, secret) => {
    if (err || foundUser.username !== secret.UserInfo.username) return res.sendStatus(403);
    //const roles = Object.values(foundUser.roles);
    //const employeeID = Object.values(foundUser.employeeId);
    const payload = {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles || {},
      }
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    res.json(accessToken);
  });
};
module.exports = { handleRefreshToken };
