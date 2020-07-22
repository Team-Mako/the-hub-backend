import Post from '../models/Post';

class TopCategoriesController {
  async index(req, res) {
    const { userId } = req;

    try {
      const result = await Post.topCategories(userId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new TopCategoriesController();
