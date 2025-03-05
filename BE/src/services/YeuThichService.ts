import { ObjectId } from 'mongodb';
import yeuthichModel from "../models/YeuThichModel";

export class YeuThichSevice {
  async createYeuThich(body: any): Promise<void> {
    const data = body;

    const newYeuThich = new yeuthichModel({
      ma_phong: data.ma_phong,
      id_user: data.id_user,
    });
    await newYeuThich.save();
  }

  async deleteById(id_user: ObjectId): Promise<void> {
    const deleteYeuThich = await yeuthichModel.findOne({ id_user });
    if (!deleteYeuThich) {
      throw new Error("Không tìm thấy mục yêu thích của người dùng này");
    }
    await yeuthichModel.deleteOne({ id_user });
  }

  async getDataYeuTich(id_user: string): Promise<any> {
    const id = new ObjectId(id_user);

    const result = await yeuthichModel.aggregate([
      {
        $match: { id_user: id }
      },
      {
        $lookup: {
          from: 'phongtros',
          localField: 'ma_phong',
          foreignField: 'ma_phong',
          as: 'phongTro_yeu_thich'
        }
      },
      {
        $project: {
          ma_phong: 1,
          id_user: 1,
          phongTro_yeu_thich: {
            $map: {
              input: '$phongTro_yeu_thich',
              as: 'pt',
              in: {
                ma_phong: '$$pt.ma_phong',
                id_users: '$$pt.id_users',
                ten_phong_tro: '$$pt.ten_phong_tro',
                dia_chi: '$$pt.dia_chi',
                anh_phong: '$$pt.anh_phong',
                mo_ta: '$$pt.mo_ta',
                dien_tich: '$$pt.dien_tich',
                gia_tien: '$$pt.gia_tien',
                trang_thai: '$$pt.trang_thai',
                so_luong_nguoi: '$$pt.so_luong_nguoi',
                createdAt: '$$pt.createdAt',
                updatedAt: '$$pt.updatedAt',
                __v: '$$pt.__v'
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$id_user',
          phongTro_yeu_thich: { $push: '$phongTro_yeu_thich' }
        }
      },
      {
        $project: {
          phongTro_yeu_thich: {
            $reduce: { // Loại bỏ các ma_phong trùng lặp
              input: '$phongTro_yeu_thich',
              initialValue: [],
              in: {
                $cond: {
                  if: { $eq: [{ $size: '$$value' }, 0] }, // Nếu mảng rỗng, thêm tất cả
                  then: '$$this',
                  else: {
                    $concatArrays: [
                      '$$value',
                      {
                        $cond: {
                          if: {
                            $in: ['$$this.ma_phong', '$$value.ma_phong'] // Kiểm tra ma_phong đã tồn tại chưa
                          },
                          then: [], // Nếu trùng, không thêm
                          else: ['$$this'] // Nếu không trùng, thêm vào
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    ]);

    return result[0] || null; // Trả về bản ghi đầu tiên hoặc null nếu không có dữ liệu
  }

  async getAllYeuTich(): Promise<any[]> {

    return await yeuthichModel.aggregate([
      {
        $lookup: {
          'from': 'phongtros',
          'localField': 'ma_phong',
          'foreignField': 'ma_phong',
          'as': 'phongTro_yeu_thich'
        }
      }, {
        $unwind: {
          'path': '$phongTro_yeu_thich',
          preserveNullAndEmptyArrays: true
        }
      },
    ]);
  }

  async getChartData(): Promise<any> {
    // Thống kê yêu thích theo phòng
    const yeuThichTheoPhong = await yeuthichModel.aggregate([
      {
        $group: {
          _id: "$ma_phong",
          soLuong: { $sum: 1 } // Đếm số lượng yêu thích
        }
      },
      {
        $lookup: {
          from: "phongtros",
          localField: "_id",
          foreignField: "ma_phong",
          as: "thongTinPhong"
        }
      },
      {
        $unwind: "$thongTinPhong"
      },
      {
        $project: {
          maPhong: "$_id", // Mã phòng
          tenPhong: "$thongTinPhong.ten_phong", // Tên phòng
          soLuotYeuThich: "$soLuong" // Số lượt yêu thích
        }
      },
      {
        $sort: { soLuotYeuThich: -1 } // Sắp xếp giảm dần theo số lượt yêu thích
      },
      {
        $limit: 10 // Giới hạn 10 phòng được yêu thích nhất
      }
    ]);

    // Thống kê yêu thích theo thời gian
    const yeuThichTheoThoiGian = await yeuthichModel.aggregate([
      {
        $group: {
          _id: {
            nam: { $year: "$createdAt" }, // Năm
            thang: { $month: "$createdAt" } // Tháng
          },
          soLuong: { $sum: 1 } // Đếm số lượng yêu thích
        }
      },
      {
        $sort: { "_id.nam": 1, "_id.thang": 1 } // Sắp xếp tăng dần theo năm và tháng
      },
      {
        $project: {
          thoiGian: { // Thời gian (YYYY-MM)
            $concat: [
              { $toString: "$_id.nam" },
              "-",
              { $toString: "$_id.thang" }
            ]
          },
          soLuotYeuThich: "$soLuong" // Số lượt yêu thích
        }
      }
    ]);

    // Trả về dữ liệu với tên tiếng Việt
    return {
      yeuThichTheoPhong, // Danh sách yêu thích theo phòng
      yeuThichTheoThoiGian // Danh sách yêu thích theo thời gian
    };
  }
}
const YeuThich = new YeuThichSevice()
export default YeuThich