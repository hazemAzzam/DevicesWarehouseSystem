const express = require("express");
const router = express.Router();
const deviceService = require("../services/deviceService");

// الحصول على جميع الأجهزة
router.get("/", async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({ success: true, data: devices });
  } catch (error) {
    console.error("Error in GET /devices:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// إضافة جهاز جديد
router.post("/", async (req, res) => {
  try {
    const { deviceName, deviceType, serialNumber } = req.body;

    // التحقق من البيانات المطلوبة
    if (!deviceName || !deviceType || !serialNumber) {
      return res.status(400).json({
        success: false,
        error: "جميع الحقول مطلوبة (اسم الجهاز، نوع الجهاز، الرقم التسلسلي)",
      });
    }

    // التحقق من عدم تكرار الرقم التسلسلي
    const existingDevice = await deviceService.getDeviceBySerial(serialNumber);
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        error: "الرقم التسلسلي موجود بالفعل",
      });
    }

    const result = await deviceService.addDevice({
      deviceName,
      deviceType,
      serialNumber,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in POST /devices:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// تحديث جهاز
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceName, deviceType, serialNumber } = req.body;

    // التحقق من البيانات المطلوبة
    if (!deviceName || !deviceType || !serialNumber) {
      return res.status(400).json({
        success: false,
        error: "جميع الحقول مطلوبة (اسم الجهاز، نوع الجهاز، الرقم التسلسلي)",
      });
    }

    const result = await deviceService.updateDevice(id, {
      deviceName,
      deviceType,
      serialNumber,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in PUT /devices:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// حذف جهاز
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deviceService.deleteDevice(id);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in DELETE /devices:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
