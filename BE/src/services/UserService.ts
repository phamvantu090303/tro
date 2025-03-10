import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import {
  getAccesstoken,
  SignTokenRestPassWord,
  signverifyEmailToken,
} from "../utils/getAccesstoken";
import { UserVerifyStatus } from "../constants/enum";
import { ObjectId } from "mongodb";

export class UserService {
  async registerUser(body: any): Promise<string> {
    const { email, password } = body;
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error(`Tài khoản đã tồn tại`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    body.password = hashpassword;

    // Save new user
    const newUser: any = new UserModel(body);
    const savedUser = await newUser.save();
    const userId = savedUser._id;
    const email_verify_token = await signverifyEmailToken({
      _id: userId,
      verify: UserVerifyStatus.Unverified,
    });

    return email_verify_token; // Trả về token
  }

  async loginUser(user_id: any, verify: UserVerifyStatus): Promise<string> {
    const token = await getAccesstoken({
      _id: user_id,
      verify: verify,
    });
    return token;
  }

  async forgotPassword(
    user_id: any,
    verify: UserVerifyStatus
  ): Promise<string> {
    const forgot_password_token = await SignTokenRestPassWord({
      _id: user_id,
      verify: verify,
    });
    return forgot_password_token;
  }

  async ResetPassWord(
    user_id: any,
    password: string
  ): Promise<{ message: string }> {
    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new Error(`User không Tồn Tại!!!`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return {
      message: "Đổi mật khẩu thành công",
    };
  }

  async updateUserService(_id: any, data: any): Promise<void> {
    const id = new ObjectId(_id);
    const {
      id_quyen,
      email,
      password,
      username,
      ho_va_ten,
      ngay_sinh,
      verify,
      que_quan,
      so_dien_thoai,
      gioi_tinh,
      cccd,
    } = data;

    // Kiểm tra danh mục cần cập nhật có tồn tại không
    const update = await UserModel.findById(id);
    if (!update) {
      throw new Error("ID admin không tồn tại");
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }

    update.id_quyen = id_quyen ?? update.id_quyen;
    update.email = email ?? update.email;
    update.username = username ?? update.username;
    update.ho_va_ten = ho_va_ten ?? update.ho_va_ten;
    update.ngay_sinh = ngay_sinh ?? update.ngay_sinh;
    update.verify = verify ?? update.verify;
    update.que_quan = que_quan ?? update.que_quan;
    update.so_dien_thoai = so_dien_thoai ?? update.so_dien_thoai;
    update.gioi_tinh = gioi_tinh ?? update.gioi_tinh;
    update.cccd = cccd ?? update.cccd;

    await update.save();
  }

  async getMe(user_id: string) {
    const user = await UserModel.findOne({ _id: new ObjectId(user_id) }).select(
      " -createdAt -updatedAt -__v"
    ); // Ẩn các trường không cần thiết

    return user;
  }

  async getUserAll() {
    const user = await UserModel.find().select("-createdAt -updatedAt -__v");
    return user;
  }

  async getUserDetail(user_id: string) {
    const result = await UserModel.aggregate([
      {
        $match: { _id: new ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "phongtros",
          let: { userId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$id_users", "$$userId"] },
              },
            },
            {
              $project: {
                _id: 0,
                id_users: 0,
                __v: 0,
                trang_thai: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          ],
          as: "phongTro",
        },
      },
      {
        $project: {
          _id: 0,
          id_quyen: 0,
          password: 0,
          __v: 0,
          verify: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      },
    ]);

    return result[0] || null;
  }
}
