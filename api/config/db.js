const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://mongo:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Kết nối thành công với MongoDB");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;