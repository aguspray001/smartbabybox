const { Sequelize } = require("../models");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");

const { sign } = require("../helpers/jwtHandler");

const User = require("../models").User;

module.exports = {
  register: async (req, res) => {
    const { name, email, phone_number, password, role_id } = req.body;
    const data = {
      name,
      email,
      phone_number,
      password: bcrypt.hashSync(password, 8),
      role_id,
    };
    const checkUser = await User.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });
    // console.log(checkUser);
    // if user is not found, then make it
    if (!checkUser) {
      const resp = await User.create(data);
      res.send({ data: resp, status: 200, message: "Registration is Success" });
    } else {
      res.send({ status: 400, message: "Email has been registered" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const checkUser = await User.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });
    // console.log(checkUser.dataValues)
    if(!checkUser){
        res.status(401).json({message: "User is not found"})
    }else{
        const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
        if(isPasswordValid){
            const token = sign(checkUser.dataValues);
            res.status(200).json({data: token})
        }else{
            res.status(401).json({message: "Password is wrong"})
        }
    }
  },
};
