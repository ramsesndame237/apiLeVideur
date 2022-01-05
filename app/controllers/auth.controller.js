const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const {utils } = require('../utils')

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database

  if (req.body.phoneNumber == "") {
      res.status(403).send({
          message:"Incomplet data, please provide all the information"
      })
  } else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        phoneNumber:req.body.phoneNumber,
        status: false
      })
        .then(user => {
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles
                }
              }
            }).then(roles => {
              user.setRoles(roles).then(() => {
                let code = utils.generateKey()

                utils.saveOTP({
                    tel: user.tel,
                    email: user.email,
                    code
                }, (err) => {
                    done(user, code)
                })
                res.send({ message: "User was registered successfully!" });
              });
            });
          } else {
            // user role = 1
            user.setRoles([1]).then(() => {
              res.send({ message: "User was registered successfully!" });
            });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
  }
};


exports.signin = (req, res) => {
    User.findOne({
      where: {
        phoneNumber: req.body.phoneNumber
      }
    })
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        const passwordIsValid = user.status
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid account!"
          });
        }
  
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration
        });
  
        let refreshToken = await RefreshToken.createToken(user);
  
        let authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
  
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
          });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };
  
  exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
  
      console.log(refreshToken)
  
      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in database!" });
        return;
      }
  
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }
  
      const user = await refreshToken.getUser();
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  };