import { ObjectId } from 'mongodb';
import yeuthichModel from '../models/YeuThichModel';
import DanhGiaModel from '../models/DanhGiaModel';

export class ThongKeSevice {
    async getChartData({ ngay, thang, nam }: { ngay?: string; thang?: string; nam?: string }): Promise<any> {
        const filterByDate = (startDate: Date, endDate: Date) => ({
            $match: { createdAt: { $gte: startDate, $lte: endDate } },
        });

        const yeuThichTheoPhong = await yeuthichModel.aggregate([
            { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
            { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
            { $unwind: "$thongTinPhong" },
            { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            { $sort: { soLuotYeuThich: -1 } },
            { $limit: 10 },
        ]);

        const yeuThichTheoNgay = ngay
            ? await yeuthichModel.aggregate([
                filterByDate(new Date(ngay + "T00:00:00.000Z"), new Date(ngay + "T23:59:59.999Z")),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ])
            : await yeuthichModel.aggregate([
                filterByDate(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ]);

        const yeuThichTheoThang = thang
            ? await yeuthichModel.aggregate([
                filterByDate(
                    new Date(`${thang}-01T00:00:00.000Z`),
                    new Date(new Date(`${thang}-01`).getFullYear(), new Date(`${thang}-01`).getMonth() + 1, 0, 23, 59, 59, 999)
                ),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ])
            : await yeuthichModel.aggregate([
                filterByDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ]);

        const yeuThichTheoNam = nam
            ? await yeuthichModel.aggregate([
                filterByDate(new Date(`${nam}-01-01T00:00:00.000Z`), new Date(`${nam}-12-31T23:59:59.999Z`)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ])
            : await yeuthichModel.aggregate([
                filterByDate(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotYeuThich: "$soLuong" } },
            ]);

        return {
            yeuThichTheoPhong,
            yeuThichTheoNgay,
            yeuThichTheoThang,
            yeuThichTheoNam,
        };
    }

    async getChartDanhGia({ ngay, thang, nam }: { ngay?: string; thang?: string; nam?: string }): Promise<any> {
        const filterByDate = (startDate: Date, endDate: Date) => ({
            $match: { createdAt: { $gte: startDate, $lte: endDate } },
        });

        const danhGiaTheoPhong = await DanhGiaModel.aggregate([
            { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
            { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
            { $unwind: "$thongTinPhong" },
            { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            { $sort: { soLuotDanhGia: -1 } },
            { $limit: 10 },
        ]);

        const danhGiaTheoNgay = ngay
            ? await DanhGiaModel.aggregate([
                filterByDate(new Date(ngay + "T00:00:00.000Z"), new Date(ngay + "T23:59:59.999Z")),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ])
            : await DanhGiaModel.aggregate([
                filterByDate(new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ]);

        const danhGiaTheoThang = thang
            ? await DanhGiaModel.aggregate([
                filterByDate(
                    new Date(`${thang}-01T00:00:00.000Z`),
                    new Date(new Date(`${thang}-01`).getFullYear(), new Date(`${thang}-01`).getMonth() + 1, 0, 23, 59, 59, 999)
                ),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ])
            : await DanhGiaModel.aggregate([
                filterByDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ]);

        const danhGiaTheoNam = nam
            ? await DanhGiaModel.aggregate([
                filterByDate(new Date(`${nam}-01-01T00:00:00.000Z`), new Date(`${nam}-12-31T23:59:59.999Z`)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ])
            : await DanhGiaModel.aggregate([
                filterByDate(new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)),
                { $group: { _id: "$ma_phong", soLuong: { $sum: 1 } } },
                { $sort: { soLuong: -1 } },
                { $limit: 5 },
                { $lookup: { from: "phongtros", localField: "_id", foreignField: "ma_phong", as: "thongTinPhong" } },
                { $unwind: "$thongTinPhong" },
                { $project: { maPhong: "$_id", tenPhong: "$thongTinPhong.ten_phong", soLuotDanhGia: "$soLuong" } },
            ]);

        return {
            danhGiaTheoPhong,
            danhGiaTheoNgay,
            danhGiaTheoThang,
            danhGiaTheoNam,
        };
    }

}