import Post from '../models/Post';

class SearchController {
  async index(req, res) {
    let { search, pg, limit } = req.query;

    if (!pg) {
      pg = 1;
    }

    if (!limit) {
      limit = 20;
    }
    try {
      const result = await Post.searchByName(search, pg, limit);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new SearchController();
