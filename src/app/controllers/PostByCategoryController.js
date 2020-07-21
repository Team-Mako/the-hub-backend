import Post from '../models/Post';

class PostByCategoryController {
  async index(req, res) {
    let { pg, limit, categoryId } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }

    if (!categoryId) {
      categoryId = null;
    }

    try {
      const result = await Post.listByCategory(pg, limit, categoryId);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new PostByCategoryController();
