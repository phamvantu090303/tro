import { Request, Response } from "express";
import Electricity, { IElectricity } from "../models/Electricity";
import moment from "moment";

// Bộ nhớ tạm để lưu dữ liệu cuối ngày
let latestData: Record<string, IElectricity> = {};

// Nhận dữ liệu từ ESP32
export const receiveElectricityData = (req: Request, res: Response): void => {
  const { room_id , voltage, power, power_factor, frequency, energy, current } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!room_id || voltage === undefined || current === undefined || power === undefined) {
    res.status(400).json({ message: "Thiếu thông tin dữ liệu!" });
    return;
  }

  // Xử lý nếu giá trị bị lỗi (NaN)
  const safeVoltage = isNaN(voltage) ? 0 : voltage;
  const safeCurrent = isNaN(current) ? 0 : current;
  const safePower = isNaN(power) ? 0 : power;
  const safePowerFactor = isNaN(power_factor) ? 0 : power_factor;
  const safeFrequency = isNaN(frequency) ? 0 : frequency;
  const safeEnergy = isNaN(energy) ? 0 : energy;

  // Tính tiền điện (3000đ/kWh)
  const electricityPrice = 3000;
  const total_cost = (safePower / 1000) * electricityPrice;

  // Cập nhật dữ liệu vào bộ nhớ tạm
  latestData[room_id] = {
    room_id,
    voltage: safeVoltage,
    current: safeCurrent,
    power: safePower,
    power_factor: safePowerFactor,
    frequency: safeFrequency,
    energy: safeEnergy,
    total_cost,
    timestamp: new Date(),
  } as IElectricity;

  console.log(`Nhận dữ liệu từ phòng ${room_id}: ${safeVoltage}V - ${safeCurrent}A - ${safePower}W`);

  res.json({ message: "Dữ liệu đã nhận!" });
};

// Hàm lưu dữ liệu vào cuối ngày
export const saveEndOfDayData = async (): Promise<void> => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(`Lưu dữ liệu vào lúc: ${now}`);

  try {
    for (const room_id in latestData) {
      const data = latestData[room_id];
      const newRecord = new Electricity(data);
      await newRecord.save();
      console.log(`Dữ liệu phòng ${room_id} đã lưu vào database.`);
    }

    // Xóa bộ nhớ tạm để chuẩn bị cho lần tiếp theo
    latestData = {};
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
  }
};
