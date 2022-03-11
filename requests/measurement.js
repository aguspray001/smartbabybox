const { Sequelize } = require("../models");
const excel = require('exceljs');

const Op = Sequelize.Op;
const { handlingError, pagination, stringToDate, calculateMonth, generateId } = require("../utils");

const Measurement = require("../models").Measurement;
const Baby = require("../models").Baby;
const User = require("../models").User;

module.exports = {
  // add measurement data from baby
  add: async (req, res) => {
    const { height, weight, head_size, temperature, baby_id } = req.body;
    console.log(generateId)
    const dataBaby = {
      height,
      weight,
      head_size,
      temperature,
      baby_id,
    };

    Measurement.create(dataBaby)
      .then((r) =>
        res.send({
          data: r,
          status: 200,
          message: "Success add measurement of baby",
        })
      )
      .catch((e) => handlingError(res, e));
  },

  paging: async (req, res) => {
    const {limit, offset} = pagination(req.query.currentPage, req.query.limit);
    Measurement.findAndCountAll({
      include: [
        {
          model: Baby,
          as: "baby",
          attributes: ["name", "sex", "born_date", "id"],
          // nested include
          include : [{model: User, as: 'user', attributes: ["name", "phone_number"]}]
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    })
      .then((r) => {
        
        for(let i = 0; i<r.rows.length; i++){
          // console.log(r.rows[i].dataValues.baby)
          if(r.rows[i].dataValues.baby){
              const bornDate = stringToDate(r.rows[i].dataValues.baby.dataValues.born_date);
              const measurementDate = new Date(r.rows[i].dataValues.createdAt);
              r.rows[i].dataValues.baby.dataValues["baby_age"] = calculateMonth(bornDate, measurementDate);
            }
          }

        res.send({
          data: {...r, total_data : r.rows.length},
          status: 200,
          message: "Success get measurement data",
        });
      })
      .catch((e) => {
        handlingError(res, e);
      });
  },
  getById: async (req, res) => {
    const {babyId} = req.params;
    const {limit, offset} = pagination(req.query.currentPage, req.query.limit);
    Measurement.findAndCountAll({
      include: [
        {
          model: Baby,
          as: "baby",
          attributes: ["name", "sex", "born_date", "id"],
          // nested include
          include : [{model: User, as: 'user', attributes: ["name", "phone_number"]}]
        },
      ],
      where : {
        baby_id : {[Op.eq] : babyId || null}
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    })
      .then((r) => {
        
        for(let i = 0; i<r.rows.length; i++){
          // console.log(r.rows[i].dataValues.baby)
          if(r.rows[i].dataValues.baby){
              const bornDate = stringToDate(r.rows[i].dataValues.baby.dataValues.born_date);
              const measurementDate = new Date(r.rows[i].dataValues.createdAt);
              r.rows[i].dataValues.baby.dataValues["baby_age"] = calculateMonth(bornDate, measurementDate);
            }
          }

        res.send({
          data: {...r, total_data : r.rows.length},
          status: 200,
          message: "Success get measurement data",
        });
      })
      .catch((e) => {
        handlingError(res, e);
      });
  },
  downloadExcel: async (req, res) => {
    const {babyId} = req.params;
    const {limit, offset} = pagination(req.query.currentPage, req.query.limit);
    Measurement.findAndCountAll({
      include: [
        {
          model: Baby,
          as: "baby",
          attributes: ["name", "sex", "born_date", "id"],
          // nested include
          include : [{model: User, as: 'user', attributes: ["name", "phone_number"]}]
        },
      ],
      where : {
        baby_id : {[Op.eq] : babyId}
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    })
      .then((r) => {
        
        for(let i = 0; i<r.rows.length; i++){
          if(r.rows[i].dataValues.baby){
              const bornDate = stringToDate(r.rows[i].dataValues.baby.dataValues.born_date);
              const measurementDate = new Date(r.rows[i].dataValues.createdAt);
              r.rows[i].dataValues.baby.dataValues["baby_age"] = calculateMonth(bornDate, measurementDate);
            }
        }
        let dataTableMeasurements = [];

        r.rows.forEach((measurement)=>{
          const {baby_id, head_size, height, weight, temperature, createdAt} = measurement;
          dataTableMeasurements.push({
            baby_id,
            createdAt,
            head_size,
            height,
            weight,
            temperature
          })
        })

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Measurement');
        
        // set columns key and header name:
        worksheet.columns = [
          { header: "Tanggal", key: "createdAt", width: 25 },
          { header: "Id", key: "baby_id", width: 25 },
          { header: "Lingkar Kepala", key: "head_size", width: 20 },
          { header: "Tinggi Badan", key: "height", width: 20 },
          { header: "Berat Badan", key: "weight", width: 15 },
          { header: "Suhu Tubuh", key: "temperature", width: 15 },
        ];

        // add rows data:
        worksheet.addRows(dataTableMeasurements);
        // set alignment
        for(let j=1; j<=worksheet.columns.length; j++){
          worksheet.getColumn(j).alignment = { vertical: 'middle', horizontal: 'left' };
        }
        // set header:
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + `${babyId}.xlsx`
        );
        // return excel file:
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        }).catch((e) => {
          console.log("=> error excel: ", e)
        });
      })
      .catch((e) => {
        handlingError(res, e);
      });
  }
};
