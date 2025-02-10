import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import {
  getAccesstoken,
  SignTokenRestPassWord,
  signverifyEmailToken,
} from "../utils/getAccesstoken";
import { UserVerifyStatus } from "../constants/enum";

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


  async ResetPassWord(user_id: any, password: string):Promise<{ message: string }> {
    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new Error(`User không Tồn Tại!!!`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return ({
      message:"Đổi mật khẩu thành công"
    });
  }
}
