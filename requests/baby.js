const { Sequelize } = require("../models");
const Op = Sequelize.Op;
const { handlingError, generateId, calculateMonth, stringToDate } = require("../utils");

const Baby = require("../models").Baby;
const User = require("../models").User;

module.exports = {
  add: async (req, res) => {
    try {
      const { name, born_date, sex } = req.body;
      const babyId = generateId();
      const babyData = {
        id: babyId,
        name,
        born_date,
        sex,
        user_id: req.user.id,
      };

      Baby.create(babyData)
        .then((r) => {
          res.send({ data: r, status: 200, message: "Success add baby" });
        })
        .catch((e) => {
          handlingError(res, e);
        });
    } catch (e) {
      handlingError(res, e);
    }
  },
  getBabyList: async (req, res) => {
    Baby.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "phone_number"]
        },
      ],
      where: {
        user_id: { [Op.eq]: req.user.id },
      },
    })
      .then((r) => {

        for(let i = 0; i<r.length; i++){
            const bordDate = stringToDate(r[i].dataValues.born_date);
            const nowDate = new Date();
            r[i].dataValues["baby_age"] = calculateMonth(bordDate, nowDate);
        }

        res.json({
          data: r,
          status: 200,
          message: r.length === 0 ? "No babies data" : "Success get baby data",
        });
      })
      .catch((e) => handlingError(res, e));
  },
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const { name, born_date, sex, user_id } = req.body;
      const babyData = {
        name,
        born_date,
        sex,
        user_id,
      };

      const baby = await Baby.findByPK(id);
      if (!baby) {
        res.send({ data: baby, status: 400, message: "Baby is not found" });
      } else {
        baby
          .update(babyData)
          .then((r) => {
            res.send({
              data: r,
              status: 200,
              message: "Success update baby data",
            });
          })
          .catch((e) => {
            handlingError(res, e);
          });
      }
    } catch (e) {
      handlingError(res, e);
    }
  },
  loginBabyBox: async (req, res) => {
    const {id} = req.body;

    const baby = await Baby.findOne({
      where : {
        id : {[Op.eq] : id}
      }
    });

    if(baby){
      res.status(301).json({message: 'Success to get baby data', data: baby, status: 301})
    }else{
      res.status(300).json({message: 'Failed to get baby data', status: 300})
    }
  }
};
