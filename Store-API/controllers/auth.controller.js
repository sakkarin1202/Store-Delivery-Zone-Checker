const config = require("../config/auth.consfig");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//Register a new user
exports.signup = async (req, res) => {
  console.log(req.body); // ดูค่าที่ส่งมา

  const { username, password, email, address, latitude, longitude, roles } = req.body;

  // ตรวจสอบฟิลด์ที่จำเป็น
  if (!username || !password || !email || !address || !latitude || !longitude) {
      return res.status(400).send({
          message: "กรุณาระบุฟิลด์ที่จำเป็นทั้งหมด",
      });
  }

  // เตรียมข้อมูลผู้ใช้ โดยไม่ต้องมี userId
  const newUser = {
      username: username,
      password: bcrypt.hashSync(password, 8),
      email: email,
      address: address,
      latitude: latitude,
      longitude: longitude,
  };

  try {
      // บันทึกผู้ใช้ในฐานข้อมูล
      const user = await User.create(newUser);

      // ตั้งค่าบทบาทของผู้ใช้
      if (roles) {
          const foundRoles = await Role.findAll({
              where: {
                  name: {
                      [Op.or]: roles,
                  },
              },
          });
          await user.setRoles(foundRoles);
      } else {
          // ถ้าไม่มีบทบาท ให้ตั้งค่าบทบาทเริ่มต้นเป็น 1 (user)
          await user.setRoles([1]);
      }

      return res.send({
          message: "ผู้ใช้ลงทะเบียนสำเร็จ!",
      });
  } catch (error) {
      console.error("Error during signup:", error); // แสดงข้อผิดพลาดใน console
      return res.status(500).send({
          message:
              error.message || "เกิดข้อผิดพลาดระหว่างการลงทะเบียนผู้ใช้ใหม่",
      });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  console.log("Received Username:", username);
  console.log("Received Password:", password);

  if (!username || !password) {
      return res.status(400).send({
          message: "โปรดระบุชื่อผู้ใช้และรหัสผ่าน",
      });
  }

  try {
      // ค้นหาผู้ใช้ในฐานข้อมูล
      const user = await User.findOne({ where: { username: username } });

      // ตรวจสอบว่าพบผู้ใช้หรือไม่
      if (!user) {
          return res.status(404).send({ message: "ไม่พบผู้ใช้" });
      }

      // ตรวจสอบรหัสผ่าน
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
          return res.status(401).send({
              accessToken: null,
              message: "รหัสผ่านไม่ถูกต้อง",
          });
      }

      // สร้าง token
      const token = jwt.sign({ id: user.userId }, config.secret, {
          expiresIn: 86400, // 1 วัน
      });

      // ดึงบทบาทของผู้ใช้
      const authorities = [];
      const roles = await user.getRoles();
      roles.forEach(role => {
          authorities.push("ROLES_" + role.name.toUpperCase());
      });

      // ส่งข้อมูลผู้ใช้และ token
      return res.status(200).send({
          id: user.userId,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
      });

  } catch (error) {
      return res.status(500).send({
          message: error.message || "เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ",
      });
  }
};
