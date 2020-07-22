import Post from '../models/Post';

class PostsViewsController {
  async show(req, res) {
    const { userId } = req;

    try {
      const result = await Post.timelineView(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new PostsViewsController();
