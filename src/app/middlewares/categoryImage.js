import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default (req, res, next) => {
  const img = resolve(__dirname, '..', '..', '..', 'tmp', req.file.filename);

  const pictureName = urlSlugify.slugify(req.body.title);
  const extension = extname(req.file.originalname);

  const bigPic = resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-category-${pictureName}${extension}`);
  const smallPic = resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-category-small-${pictureName}${extension}`);

  Jimp.read(img)
    .then((image) => {
      image.scaleToFit(830, 830);
      image.write(bigPic);
      image.crop(205, 0, 450, 550);
      image.write(smallPic);
      req.body.cover = `the-hub-category-${pictureName}${extension}`;
      req.body.coverSmall = `the-hub-category-small-${pictureName}${extension}`;

      next();
    })
    .catch((err) => res.json(err));
};
