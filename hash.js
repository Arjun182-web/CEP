const bcrypt = require("bcryptjs");

bcrypt.hash("Arjunroy@395725", 10).then((hash) => {
  console.log("Hashed password:", hash);
});
