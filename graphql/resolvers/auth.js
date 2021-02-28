const bcrypt = require('bcryptjs');

// TODO: rename to user and abstract auth logic to a different file
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

*/
