const Role = require('../models').Role;
const { handlingError } = require('../utils');

module.exports = {
    add : async (req, res) => {
        try {
            const {role_name} = req.body;
            const createRole = await Role.create({role_name});
            res.send({data: createRole, message: 'Role has been created successfully', status: 200})
        } catch (e) {
            handlingError(res, e.message);
        }
    },
}