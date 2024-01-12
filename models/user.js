'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({
    // first name is required and cannot be empty
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First Name is required.'
      },
      notEmpty: {
        msg: 'Please enter First Name.'
    },
      }
    },
    // last name is required and cannot be empty    
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name is required.'
      },
      notEmpty: {
        msg: 'Please enter Last Name.'
    },
      }
    },
 // email is required, cannot be empty, unique and email type
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : {
        msg: 'This email address is already in use.'
      },
      validate: {
        notNull:{
          msg: 'Email is required.'
        },
        isEmail : {
          msg: 'Please enter a valid email address.'
        }
      }
    },

// password is required, cannot be empty and is stored hashed    
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required.'
        },
        notEmpty: {
          msg: 'Please enter a password.'
        }
      },
      set(val) {
        if (val){
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(val, salt);
          this.setDataValue('password', hashedPassword);
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

// user is linked to courses, 1 user can have multiple courses  
  User.associate = (model) => {
    User.hasMany(model.Course, {
      as: 'Instructor', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: true,
      },
    });
  }

  return User;
};