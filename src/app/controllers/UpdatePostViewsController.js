import Post from '../models/Post';

class UpdatePostViewsController {
  async store(req, res) {
    const { postId, userId } = req.query;

    try {
      const result = await Post.updateViews(postId, userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UpdatePostViewsController();
