const Joi = require('joi');
const Constant = require('./../config/constant');
const User = require('./../models/user');
const Bcrypt = require('./../lib/bcrypt');
const Jwt = require('./../middleware/auth');

module.exports = {

    // user login
    signin: (req, res) => {

        try {
            let schema = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required()
            })

            let result = schema.validate(req.body);

            if (result.error) {
                res.status(Constant.Code.ERROR).json({ messade: "Invalid Email or Password" });
                return;
            }

            let criteria = { email: result.value.email }

            User.findOne(criteria)
                .lean()
                .then(data => {
                    if (data) {
                        let isPasswordMatched = Bcrypt.compare(result.value.password, data.password);
                        if (isPasswordMatched) {
                            delete (data.password);
                            data.token = Jwt.encrypt(data);

                            res.status(Constant.Code.SUCCESS).json({ message: "Successfully Logged in", data: data });
                        } else {
                            res.status(Constant.Code.ERROR).json({ message: "Password doesn't matched." });
                        }
                        return;
                    }

                    res.status(Constant.Code.NOT_FOUND).json({ message: "User Not Found" });

                })
                .catch(error => {
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })

        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    },

    // user signup
    signup: (req, res) => {
        try {
            let schema = Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string()
            })

            let result = schema.validate(req.body);

            if (result.error) {
                res.status(Constant.Code.ERROR).json({ messade: "Please provide valid info." });
                return;
            }

            result.value.password = Bcrypt.encrypt(result.value.password);
            result.value.created_on = new Date();

            User.create(result.value)
                .then(data => {
                    data = data.toObject();
                    delete (data.password);
                    data.token = Jwt.encrypt(data);

                    res.status(Constant.Code.SUCCESS).json({ message: "User successfully created", data });
                })
                .catch(error => {
                    if (error.code === 11000) {
                        res.status(Constant.Code.ERROR).json({ message: "User with given email already exists" });
                        return;
                    }
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })
        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    }
}