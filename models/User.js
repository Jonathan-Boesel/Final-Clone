var Promise = require('bluebird')
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: { // email address
     id: { // we will use this as primary key
      type: DataTypes.INTEGER,
      primaryKey: true
    },
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: { // the users password
        type: DataTypes.STRING,
        allowNull: false,
        len: [1]
    },
    username: { // the users password
        type: DataTypes.STRING,
         unique: true,
        allowNull: false,
        len: [1]
    },
    userFirstName: { // first name
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    userLastName: { // last name
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
  isBand: { // is this a existing band
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    
    instrumentsPlayed: { // what they play
        type: DataTypes.STRING,
        allowNull: false,
        len: [1]
    },
    searchingFor: {// who they want to jam with
        type: DataTypes.STRING,
        allowNull: false,
        len: [1]
    },
    genre: {// what music they're into
        type: DataTypes.STRING,
        allowNull: true,
        len: [1]
    },
    about: {// a bit about the user
        type: DataTypes.TEXT,
        allowNull: true,
        len: [1]
    },
    userLocation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
     userImage: {
      type: DataTypes.STRING,

      allowNull: true,
      isUrl: true
    },
     faceBook: {// link to facebook
        type: DataTypes.TEXT,
        allowNull: true,
        len: [1]
    },
     reverbNation: {// link to reverbNation
        type: DataTypes.TEXT,
        allowNull: true,
        len: [1]
    },
     
      soundCloud: {// link to soundcloud
        type: DataTypes.TEXT,
        allowNull: true,
        len: [1]
    },
     
    
  });
 User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
