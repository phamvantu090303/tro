import { Request, Response, NextFunction } from "express";

export const userRegisterRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    return res.status(400).json({
      message: "Email không để trống!",
    });
  }

  if (!req.body.password) {
    return res.status(400).json({
      message: "Password không để trống!",
    });
  }

  // if (!req.body.username) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }

  // if (!req.body.ho_va_ten) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
  // if (!req.body.ngay_sinh) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
  // if (!req.body.que_quan) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
  // if (!req.body.so_dien_thoai) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
  // if (!req.body.gioi_tinh) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
  // if (!req.body.cccd) {
  //   return res.status(400).json({
  //     message: "Name không để trống!",
  //   });
  // }
 
  next();
};


export const UserLoginRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    return res.status(400).json({
      message: "Email không để trống!",
    });
  }

  if (!req.body.password) {
    return res.status(400).json({
      message: "Password không để trống!",
    });
  }

  next();
};
