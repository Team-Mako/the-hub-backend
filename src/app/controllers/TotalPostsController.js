import Post from '../models/Post';

class TotalPostsController {
  async show(req, res) {
    let { user, category } = req.query;

    if (!user) {
      user = null;
    }

    if (!category) {
      category = null;
    }

    try {
      const result = await Post.totalPosts(user, category);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new TotalPostsController();
