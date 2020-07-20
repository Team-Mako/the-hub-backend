import Post from '../models/Post';

class UpdatePostViewsController {
  async store(req, res) {
    const { postId } = req.params;

    try {
      const result = await Post.updateViews(postId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new UpdatePostViewsController();
