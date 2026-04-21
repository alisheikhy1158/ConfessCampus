import Comment from "../models/Comment.js";

export const addComment = async (req, res, next) => {
    try {
        const { postId } = req.params; 
        const { content, isAnonymous } = req.body;
        const userId = req.userId; 

        if (!content) {
            return res.status(400).json({
                message: "Comment content is required.",
                success: false
            });
        }

        const comment = await Comment.create({
            post: postId,
            user: userId,
            content,
            isAnonymous: isAnonymous !== undefined ? isAnonymous : true
        });

        await comment.populate("user", "username");

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
            success: true
        });

    } catch (error) {
        next(error);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments,
            success: true
        });

    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId; 

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found.",
                success: false
            });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({
                message: "You do not have permission to delete this comment.",
                success: false
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true
        });

    } catch (error) {
        next(error);
    }
};