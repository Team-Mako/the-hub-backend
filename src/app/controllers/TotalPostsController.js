import Post from '../models/Post';

class TotalPostsController {
  async show(req, res) {
    let { user, category, search } = req.query;

    if (!user) {
      user = null;
    }

    if (!category) {
      category = null;
    }

    if (!search) {
      search = null;
    }

    try {
      const result = await Post.totalPosts(user, category, search);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new TotalPostsController();
