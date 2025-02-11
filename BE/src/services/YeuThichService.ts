
import yeuthichModel from "../models/YeuThichModel";

export class YeuThichSevice {
    async createYeuThich(body: any): Promise<void> {
        const data = body;
    
        const newYeuThich = new yeuthichModel({
            ma_phong : data.ma_phong,
            id_user : data.id_user,
            hinh_anh: data.so_luong_thiet_bị,
            gia_thue: data.gia_thue,
            mo_ta: data.mo_ta,
            trang_thai: data.trang_thai,
        }); 
        await newYeuThich.save();
    } 

    async deleteById(_id: any): Promise<void> {
        const newYeuThich = await yeuthichModel.findById(_id)
        if(!newYeuThich){
            throw new Error ("loi")
        }
        await yeuthichModel.findByIdAndDelete(_id)
    } 
    
}
const YeuThich =new YeuThichSevice()
export default YeuThich