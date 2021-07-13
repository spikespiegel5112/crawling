const express = require('express');
const crawler = require('crawler');
const uuidv1 = require('uuid/v1');
const UserModel = require('../models/UserModel');

let headers = {};

let dataJSONHeadersSample = {};

const register = (req, res, next) => {

    UserModel.create({
        loginName: req.body.loginName,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address
    }).then(response => {
        res.status(200).json({
            data: response
        });
    }).catch(error => {
        res.status(400).json({
            error: error
        });
    });

};

const login = (req, res, next) => {
    UserModel.findOne({
        where: {
            loginName: req.query.loginName
        }
    }).then(response => {
        if (response.password === req.query.password) {
            res.status(200).json({
                data: req.query
            });
        } else {
            res.status(400).json({
                message: '密码不对'
            });
        }
    }).catch(error => {
        res.status(400).json({
            message: '无此用户'
        });
    });
};

const logout = (req, res, next) => {
    UserModel.findOne({
        where: {
            loginName: req.body.loginName
        }
    }).then(response => {
        res.status(200).json({
            message: '注销成功',
            data: response
        });
    }).catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

const userInfo = (req, res, next) => {
    UserModel.findOne({
        where: {
            userId: req.query.userId
        }
    }).then(response => {
        res.status(200).json({
            data: response
        });
    }).catch(error => {
        res.status(400).json({
            error: error
        });
    });
};



exports.register = register;
exports.login = login;
exports.logout = logout;
exports.userInfo = userInfo;