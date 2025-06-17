
/*const userDB = {
  user: require("../model/users.json"),
  setUsers: (data) => {
    this.user = data;
  },
};
const fsPromises = require("fs/promises");
const path = require("path");*/
const User = require("../model/User");
const Employee = require("../model/Employee");


const handleLogout = async (req, res) => {
  const cookies = req.cookies;
 // console.log("Cookies received in logout:", cookies);

  if (!cookies?.jwt) {
    return res.sendStatus(204); 
  }

  const refreshToken = cookies.jwt;
  const foundEmployee = await Employee.findOne({ refreshToken }).exec();
  const foundUser =
    foundEmployee || (await User.findOne({ refreshToken }).exec());

  if (foundUser) {
    foundUser.refreshToken = "";
    await foundUser.save();
    console.log("Refresh token cleared for user:", foundUser.username);
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.sendStatus(204); 
};



    //const foundUser = userDB.user.find(person => person.refreshToken === refreshToken);
   
    
    /*const otherUsers = userDB.user.filter(person => person.username !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ""};
    userDB.setUsers([...otherUsers,currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"), JSON.stringify(userDB.user)
    )*/
    



module.exports = {handleLogout}