import Post from '../models/Post';

class SearchController {
  async index(req, res) {
    const { search } = req.query;
    try {
      const result = await Post.searchByName(search);
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new SearchController();
