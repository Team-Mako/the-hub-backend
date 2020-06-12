import * as yup from 'yup';
import Type from '../models/Type';

class TypeController {
  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Missing or Invalid Data' });
    }

    try {
      const result = await Type.create(req.body);
      result.message = 'Type Created';
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.code });
    }
  }
}

export default new TypeController();
