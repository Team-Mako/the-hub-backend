import Jimp from 'jimp';
import { resolve } from 'path';

export default (req, res, next) => {
  const img = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', req.file.filename);

  Jimp.read(img)
    .then((image) => {
      image.write(resolve(__dirname, '..', '..', 'uploads', req.file.filename));
      image.scaleToFit(830, 830);
      image.crop(205, 0, 450, 550);
      image.write(resolve(__dirname, '..', '..', 'uploads', `the-hub-category-small-${req.file.filename}`));
      next();
    })
    .catch((err) => res.json(err));
};
