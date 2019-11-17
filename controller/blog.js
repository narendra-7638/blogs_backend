const Blogs = require('./../models/blogs');
const Joi = require('joi');
const Constant = require('./../config/constant');
const mongoose = require('mongoose');

module.exports = {

    // get blogs
    getList: async (req, res) => {
        try {
            let schema = Joi.object().keys({
                skip: Joi.number().integer().default(0),
                limit: Joi.number().integer().default(10),
                search: Joi.string().trim()
            })

            let result = schema.validate(req.query);

            if (result.error) {
                res.status(Constant.Code.ERROR).json({ messade: "Invalid data" });
                return;
            }

            let blogs = [], count = 0;

            let criteria = {
                is_deleted: false
            }

            let options = {
                skip: result.value.skip,
                limit: result.value.limit,
                lean: true
            }

            if (result.value.search) {
                criteria.title = { $regex: result.value.search, $options: "i" }
            }

            blogs = await Blogs.find(criteria, {}, options);
            count = await Blogs.count(criteria);

            let obj = {
                blogs,
                count
            }

            res.status(Constant.Code.SUCCESS).json({ message: "Success", data: obj });
        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    },

    // get blog by id
    get: (req, res) => {
        try {

            let criteria = {
                _id: mongoose.Types.ObjectId(req.params.id),
                is_deleted: false
            }

            Blogs.findOne(criteria, {}, { lean: true })
                .then(data => {
                    if (data) {
                        res.status(Constant.Code.SUCCESS).json({ message: "Success", data: data });
                    } else {
                        res.status(Constant.Code.NOT_FOUND).json({ message: "Not Found!!!", data: data });
                    }
                })
                .catch(error => {
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })

        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    },

    // create blogs
    create: (req, res) => {
        try {
            let schema = Joi.object().keys({
                title: Joi.string().required(),
                body: Joi.string().required()
            })

            let result = schema.validate(req.body);
            if (result.error) {
                res.status(Constant.Code.ERROR).json({ messade: "Invalid data" });
                return;
            }

            result.value.created_on = new Date();
            result.value.created_by = req.user._id;

            Blogs.create(result.value)
                .then(data => {
                    res.status(Constant.Code.SUCCESS).json({ message: "Success" });
                })
                .catch(error => {
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })

        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    },

    // edit blogs
    edit: (req, res) => {
        try {
            let schema = Joi.object().keys({
                title: Joi.string().required(),
                body: Joi.string().required()
            })

            let result = schema.validate(req.body);
            if (result.error) {
                res.status(Constant.Code.ERROR).json({ messade: "Invalid data" });
                return;
            }

            result.value.updated_on = new Date();
            result.value.updated_by = req.user._id;

            let criteria = {
                _id: mongoose.Types.ObjectId(req.params.id),
                is_deleted: false
            }

            let data = {
                $set: result.value
            }

            Blogs.findOneAndUpdate(criteria, data, { new: true, lean: true })
                .then(data => {
                    if(data){
                        res.status(Constant.Code.SUCCESS).json({ message: "Success", data: data });
                        return;    
                    }
                    res.status(Constant.Code.NOT_FOUND).json({ message: "Not Found", data: data });
                    
                })
                .catch(error => {
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })

        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }
    },

    // delete blogs
    delete: (req, res) => {

        try {

            let criteria = {
                _id: mongoose.Types.ObjectId(req.params.id),
                is_deleted: false
            }

            let data = {
                $set: {
                    is_deleted: true,
                    deleted_by: req.user._id
                }
            }

            Blogs.findOneAndUpdate(criteria, data)
                .then(data => {
                    res.status(Constant.Code.SUCCESS).json({ message: "Success" });
                })
                .catch(error => {
                    res.status(Constant.Code.ERROR).json({ message: "Error" });
                })

        } catch (error) {
            res.status(Constant.Code.ERROR).json({ message: "Error" });
        }

    }

}