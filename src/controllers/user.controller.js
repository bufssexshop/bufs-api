const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usuario.model');

module.exports = {
  async signup(req, res){
    try {
      const { body } = req;
      const user = await User.create(body);

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.SECRET,
        {expiresIn: 60 * 60}
      );

      res.status(201).json(token);
    } catch(error ){
      res.status(400).json({error});
    }
  },
  async signin(req, res){
    try {
      const { email, password } = req.body;

      const user = await User.findOne({email});

      if(!user){
        throw Error('Usuario o contraseña invalido');
      };

      const isValid = await bcrypt.compare(password, user.password);

      if(!isValid){
        throw Error('Usuario o contraseña invalido');
      };

      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.SECRET,
        { expiresIn: 60 * 60}
      );

      res.status(201).json(token);
    } catch(error) {
      res.status(401).json({message: error.message});
    }
  }
}