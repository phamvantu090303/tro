import dotenv from "dotenv";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { Request, Response } from "express";
import HopDongModel from "../models/HopDongModel";
import PhongtroModel from "../models/PhongTroModel";

const generatePDF = async (htmlContent: string, email: string) => {
  // Đường dẫn thư mục pdfs
  const pdfDirectory = path.join(__dirname, "..", "pdfs");

  // Kiểm tra xem thư mục pdfs có tồn tại không, nếu không thì tạo mới
  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  const pdfPath = path.join(pdfDirectory, `${email}_contract.pdf`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content HTML cho trang
  await page.setContent(htmlContent);

  // Tạo PDF và lưu vào file
  await page.pdf({ path: pdfPath, format: "a4" });

  await browser.close();

  return pdfPath;
};
// Gửi email kèm hợp đồng PDF
interface User {
  username: string;
  email: string;
}

const sendEmail = async (user: User, pdfPath: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: user.email,
    subject: "Hợp đồng thuê trọ",
    text: `Chào ${user.username},\n\nDưới đây là hợp đồng thuê trọ của bạn.\n\nTrân trọng!`,
    attachments: [{ filename: "hopdong.pdf", path: pdfPath }],
  };

  await transporter.sendMail(mailOptions);
};

// API tạo hợp đồng
export const createContract = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const { maphong, signature, htmlContent, start_date, end_date } = req.body;
    const ma_phong = maphong;
    const phong = await PhongtroModel.findOne({ ma_phong });
    console.log(phong);
    const { username, email } = user;

    // Tạo file image từ base64
    const signaturePath = path.join(
      __dirname,
      "..",
      "signatures",
      `${username}_signature.png`
    );
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(signaturePath, base64Data, "base64");

    // Tạo file PDF từ HTML

    const pdfPath = await generatePDF(htmlContent, email);

    // Chèn chữ ký vào PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1]; // Lấy trang cuối cùng

    const signatureImageBytes = fs.readFileSync(signaturePath);
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureDims = signatureImage.scale(0.5);

    // Lấy kích thước trang PDF
    const { width, height } = lastPage.getSize();

    // Điều chỉnh tọa độ x và y để đặt chữ ký dưới phần "ĐẠI DIỆN BÊN THUÊ ( B )"
    lastPage.drawImage(signatureImage, {
      x: width / 2 - signatureDims.width / 2 + 20,
      y: 600,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);

    // Gửi email kèm hợp đồng
    await sendEmail({ username, email }, pdfPath);

    if (!phong) {
      return res.status(404).json({ message: "Không tìm thấy phòng trọ!" });
    }
    const newContract = new HopDongModel({
      ma_phong: ma_phong,
      id_users: user._id,
      signaturePath,
      tien_coc: phong.gia_tien / 2,
      start_date: start_date || new Date().toISOString().split("T")[0], // Mặc định ngày hiện tại nếu không có
      end_date: end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0], // Mặc định 1 năm sau nếu không có
      file_hop_dong: pdfPath,
      createdAt: new Date(),
    });

    await newContract.save();

    res.json({ message: "Hợp đồng đã được gửi qua email!" });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi xử lý hợp đồng." });
  }
};

export const customer = async (req: Request, res: Response) => {
  const { user }: any = req;
  const { maphong } = req.query;
  const phong = await PhongtroModel.findOne({ ma_phong: maphong });
  res.json({ user, phong });
};
