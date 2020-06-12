import * as yup from 'yup';
import Category from '../models/Category';

class CategoryController {
  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      cover: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Category.create(req.body);
      result.message = 'Category Created';
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.code });
    }
  }
}

export default new CategoryController();
