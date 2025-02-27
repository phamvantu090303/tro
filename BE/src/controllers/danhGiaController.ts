import DanhGiaService from "../services/DanhGiaService";
import e, { Request, Response } from 'express';

export const createDanhGia = async (req: Request, res: Response) => {
    try {
        const { user } = req as any;
        console.log(user);
        const data = req.body;
        const danhGiaService = new DanhGiaService();
        await danhGiaService.createDanhGia(data, user._id);
        res.status(200).json({
        message: "Đánh giá đã được tạo thành công",
        });
    } catch (error: any) {
        res.status(404).json({
        message: error.message,
        });
    }
}
export const getDataDanhGia = async (req: Request, res: Response) => {
    try {
        const { ma_phong } = req.params;
        console.log(ma_phong);
        const danhGiaService = new DanhGiaService();
        const data = await danhGiaService.getDataDanhGia(ma_phong);

        // Hàm xây dựng cây phản hồi
        const buildCommentTree = (comments: any[]) => {
            const tree: Record<string, any> = {};
            const rootComments: any[] = [];

            comments.forEach(comment => {
                tree[comment._id] = { ...comment, replies: [] };
            });

            comments.forEach(comment => {
                if (comment.repcomment) {
                    if (tree[comment.repcomment]) {
                        tree[comment.repcomment].replies.push(tree[comment._id]);
                    }
                } else {
                    rootComments.push(tree[comment._id]);
                }
            });

            return rootComments;
        };

        const commentTree = buildCommentTree(data);

        res.status(200).json({
            status: 200,
            data: commentTree,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};
export const DeleteDanhGia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const danhGiaService = new DanhGiaService();
        await danhGiaService.DeleteDanhGia(id);
        res.status(200).json({
            message: "Đánh giá đã được xóa thành công",
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
}

