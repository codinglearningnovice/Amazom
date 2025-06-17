/*const userDB = {
  user: require("../model/users.json"),
  setUsers: (data) => {
    this.user = data;
  },
};*/

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");
const Employee = require("../model/Employee");
//const fsPromises = require("fs/promises");
//const path = require("path");


const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  /*console.log("Request body:", req.body);*/
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username ad password are required" });
  //console.log("User from request:", user);
  const foundEmployee = await Employee.findOne({ username: user }).exec();
  const foundUser =
    foundEmployee || (await User.findOne({ username: user }).exec());
  //console.log("Found user:", foundUser);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);
  console.log("Comparing passwords:", pwd, foundUser.password);

  if (match) {
    const payload = {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles || {},
      },
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // saving the refresh toke to the curret user
    if (foundEmployee) {
      foundEmployee.refreshToken = refreshToken;
      await foundEmployee.save();
    } else {
      foundUser.refreshToken = refreshToken;
      await foundUser.save();
    }
    res.cookie(
      "jwt",
       refreshToken, 
      {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      }
    );

    console.log("Set-Cookie header:", res.getHeaders());
    
    /*res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })*/;
    res.json({
      accessToken,
      username: foundUser.username,
      
    });
  } else {
    res.sendStatus(401);
  }
  /*const foundUser = userDB.user.find((person) => person.username === user);
  console.log("Found user:", foundUser);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = foundUser.roles
    //console.log("this userrole is:", roles)
    const employeeID = foundUser.employeeId
    //console.log("", employeeID)
    const accessToken = jwt.sign(
      {
        UserInfo: { username: foundUser.username,roles: roles, employeeId: employeeID },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "250s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving the refresh toke to the curret user
    const otherUsers = userDB.user.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.user)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }*/
};


module.exports = { handleLogin };
