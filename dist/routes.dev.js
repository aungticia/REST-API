"use strict";

var express = require("express");

var router = express.Router(); // import models

var _require = require("./models"),
    User = _require.User;

var _require2 = require("./models"),
    Course = _require2.Course; // import middleware functions


var _require3 = require("./middleware/asyncHandler"),
    asyncHandler = _require3.asyncHandler;

var _require4 = require("./middleware/auth-user"),
    authenticateUser = _require4.authenticateUser;
/**** USERS ROUTES ***/
// READ currently authenticated user's properties and values


router.get("/users", authenticateUser, asyncHandler(function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.currentUser; // filter response to show only id, first and last name and email

          res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
})); // CREATE a new user and set the 'Location' header to '/'

router.post("/users", asyncHandler(function _callee2(req, res) {
  var errors;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 3:
          res.status(201).location("/").end();
          _context2.next = 15;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

          if (!(_context2.t0.name === "SequelizeValidationError" || _context2.t0.name === "SequelizeUniqueConstraintError")) {
            _context2.next = 14;
            break;
          }

          errors = _context2.t0.errors.map(function (err) {
            return err.message;
          });
          res.status(400).json({
            errors: errors
          });
          _context2.next = 15;
          break;

        case 14:
          throw _context2.t0;

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 6]]);
}));
/**** COURSES ROUTES ****/
// READ all courses including the User associated with each courses

router.get("/courses", asyncHandler(function _callee3(req, res) {
  var courses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Course.findAll({
            order: [["createdAt", "DESC"]],
            attributes: {
              exclude: ["createdAt", "updatedAt"]
            },
            include: [{
              model: User,
              attributes: ["id", "firstName", "lastName", "emailAddress"]
            }]
          }));

        case 2:
          courses = _context3.sent;
          res.status(200).json(courses);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
})); // READ the corresponding course including the User associated with that course

router.get("/courses/:id", asyncHandler(function _callee4(req, res) {
  var course;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Course.findByPk(req.params.id, {
            attributes: {
              exclude: ["createdAt", "updatedAt"]
            },
            include: {
              model: User,
              attributes: ["id", "firstName", "lastName", "emailAddress"]
            }
          }));

        case 2:
          course = _context4.sent;

          if (course) {
            res.status(200).json(course);
          } else {
            res.sendStatus(404);
          }

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
})); // CREATE a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content

router.post("/courses", authenticateUser, asyncHandler(function _callee5(req, res) {
  var course, errors;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Course.create(req.body));

        case 3:
          course = _context5.sent;
          res.status(201).location("/courses/".concat(course.id)).end();
          _context5.next = 15;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);

          if (!(_context5.t0.name === "SequelizeValidationError")) {
            _context5.next = 14;
            break;
          }

          errors = _context5.t0.errors.map(function (err) {
            return err.message;
          });
          res.status(400).json({
            errors: errors
          });
          _context5.next = 15;
          break;

        case 14:
          throw _context5.t0;

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
})); // UPDATE the corresponding course and return a 204 HTTP status code and no content

router.put("/courses/:id", authenticateUser, asyncHandler(function _callee6(req, res) {
  var course, courseOwner, errors;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Course.findByPk(req.params.id));

        case 3:
          course = _context6.sent;

          if (!course) {
            _context6.next = 15;
            break;
          }

          courseOwner = course.userId;

          if (!(courseOwner == req.currentUser.id)) {
            _context6.next = 12;
            break;
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(course.update(req.body));

        case 9:
          res.status(204).location("/courses/".concat(course.id)).end();
          _context6.next = 13;
          break;

        case 12:
          res.status(403).end();

        case 13:
          _context6.next = 16;
          break;

        case 15:
          res.sendStatus(404);

        case 16:
          _context6.next = 26;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);

          if (!(_context6.t0.name === "SequelizeValidationError")) {
            _context6.next = 25;
            break;
          }

          errors = _context6.t0.errors.map(function (err) {
            return err.message;
          });
          res.status(400).json({
            errors: errors
          });
          _context6.next = 26;
          break;

        case 25:
          throw _context6.t0;

        case 26:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
})); // DELETE the corresponding course and return a 204 http status code and no content

router["delete"]("/courses/:id", authenticateUser, asyncHandler(function _callee7(req, res) {
  var course, courseOwner;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Course.findByPk(req.params.id));

        case 2:
          course = _context7.sent;

          if (!course) {
            _context7.next = 14;
            break;
          }

          courseOwner = course.userId;

          if (!(courseOwner == req.currentUser.id)) {
            _context7.next = 11;
            break;
          }

          _context7.next = 8;
          return regeneratorRuntime.awrap(course.destroy());

        case 8:
          res.status(204).end();
          _context7.next = 12;
          break;

        case 11:
          res.status(403).end();

        case 12:
          _context7.next = 15;
          break;

        case 14:
          res.sendStatus(404);

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  });
}));
module.exports = router;