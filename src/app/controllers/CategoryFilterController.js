import Post from '../models/Post';

class CategoryFilterController {
  async index(req, res) {
    let {
      material, difficulty, time, categoryId, pg, limit,
    } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }

    try {
      const result = await Post.filter(material, difficulty, time, categoryId, pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new CategoryFilterController();
