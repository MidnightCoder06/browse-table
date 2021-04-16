const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secretkeythatmustbekeptonserverandawayfromclient',
      {
        expiresIn: '1h'
      }
    );
    console.log("userID:", user.id, "token:", token)
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};


/*

mutation {
  createUser(userInput: {email:"test@test.com", password: "fakePassword"}) {
    _id,
    email
  }
}

{
  "data": {
    "createUser": {
      "_id": "603bf6b75b11882f264573ab",
      "email": "test@test.com"
    }
  }
}

query {
  login(email: "test@test.com", password: "lskajf") {
    userId,
    token,
    tokenExpiration
  }
}

*/
