import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default async (req, res, next) => {
  const img = resolve(__dirname, '..', '..', '..', 'tmp', req.file.filename);

  const pictureName = urlSlugify.slugify(req.body.name);
  const extension = extname(req.file.originalname);

  const avatar = resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-avatar-${pictureName}${extension}`);

  Jimp.read(img)
    .then((image) => {
      image.scaleToFit(420, 420);
      image.write(avatar);
      req.body.avatar = `the-hub-avatar-${pictureName}${extension}`;

      next();
    })
    .catch((err) => res.json(err));
};
