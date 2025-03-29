import dotenv from "dotenv";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { Request, Response } from "express";
import HopDongModel from "../models/HopDongModel";
import PhongtroModel from "../models/PhongTroModel";
import cloudinary from "../config/cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";

const generatePDF = async (htmlContent: string, email: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "a4" });
  await browser.close();

  const result = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: "contracts",
        public_id: `${email}_contract_${Date.now()}`,
        resource_type: "raw",
        format: "pdf",
        access_mode: "public", // Đảm bảo file công khai
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(pdfBuffer);
  }).catch((error) => {
    throw new Error(`Failed to upload PDF to Cloudinary: ${error.message}`);
  });
  console.log("result", result);
  return result;
};
// Gửi email kèm hợp đồng PDF
interface User {
  username: string;
  email: string;
}

const sendEmail = async (user: User, pdfBytes: Uint8Array) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const pdfBuffer = Buffer.from(pdfBytes); // Chuyển Uint8Array thành Buffer

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: user.email,
    subject: "Hợp đồng thuê trọ",
    text: `Chào ${user.username},\n\nHợp đồng thuê trọ của bạn được đính kèm dưới đây.\n\nTrân trọng!`,
    attachments: [
      {
        filename: "hopdong.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const { maphong, signature, htmlContent, start_date, end_date } = req.body;
    const ma_phong = maphong;
    const phong = await PhongtroModel.findOne({ ma_phong });
    const { username, email } = user;

    const signatureDir = path.join(__dirname, "..", "signatures");
    if (!fs.existsSync(signatureDir))
      fs.mkdirSync(signatureDir, { recursive: true });
    const signaturePath = path.join(signatureDir, `${username}_signature.png`);
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(signaturePath, base64Data, "base64");

    const pdfPath = await generatePDF(htmlContent, email);
    const pdfResponse = await fetch(pdfPath);
    if (!pdfResponse.ok) {
      throw new Error(`Lỗi tải PDF từ Cloudinary: ${pdfResponse.statusText}`);
    }
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    const signatureImageBytes = await fs.readFileSync(signaturePath);
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureDims = signatureImage.scale(0.5);

    lastPage.drawImage(signatureImage, {
      x: width / 2 - signatureDims.width / 2 + 180,
      y: height - 130,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync("test_signed.pdf", modifiedPdfBytes); // Kiểm tra file

    const modifiedPdfUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          type: "upload",
          folder: "contracts",
          public_id: `${email}_contract_signed_${Date.now()}`,
          resource_type: "raw",
          format: "pdf",
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(modifiedPdfBytes);
    });

    // Gửi file PDF đính kèm
    await sendEmail({ username, email }, modifiedPdfBytes);

    if (!phong) {
      return res.status(404).json({ message: "Không tìm thấy phòng trọ!" });
    }

    const newContract = new HopDongModel({
      ma_phong: ma_phong,
      id_users: user._id,
      signaturePath,
      tien_coc: phong.gia_tien / 2,
      start_date: start_date || new Date().toISOString().split("T")[0],
      end_date:
        end_date ||
        new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .split("T")[0],
      file_hop_dong: modifiedPdfUrl,
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

export const extendContract = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const { ma_phong } = req.query;

    const hopDong = await HopDongModel.findOne({
      ma_phong,
      id_users: user._id,
    });

    if (!hopDong) {
      return res.status(404).json({ message: "Không tìm thấy hợp đồng!" });
    }

    const today = new Date();
    const contractEndDate = new Date(hopDong.end_date);

    if (contractEndDate >= today) {
      return res.status(400).json({ message: "Hợp đồng vẫn còn hiệu lực!" });
    }

    // Cộng thêm 1 năm vào ngày kết thúc hợp đồng
    hopDong.end_date = new Date(
      contractEndDate.setFullYear(contractEndDate.getFullYear() + 1)
    );

    await hopDong.save();

    res.json({
      message: "Hợp đồng đã được gia hạn thêm 1 năm!",
      updatedContract: hopDong,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xử lý gia hạn hợp đồng." });
  }
};

export const detailContract = async (req: Request, res: Response) => {
  try {
    const { user }: any = req;
    const contract = await HopDongModel.findOne({ id_users: user._id }).select(
      "ten_hop_dong ma_phong tien_coc file_hop_dong start_date end_date trang_thai"
    );
    if (!contract) {
      return res.status(404).json({
        message: "Bạn chưa có hợp đồng phòng trọ nào",
      });
    }
    return res.status(200).json({
      message: "Lấy chi tiết hợp đồng thành công",
      data: contract,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin hợp đồng" });
  }
};
