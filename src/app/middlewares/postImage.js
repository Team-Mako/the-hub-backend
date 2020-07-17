import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';

const urlSlugify = new URLSlugify();

export default async (req, res, next) => {
  const pictureName = urlSlugify.slugify(req.body.title);

  if (req.files.cover.length > 0) {
    const cover = resolve(__dirname, '..', '..', '..', 'tmp', req.files.cover[0].filename);

    req.body.stepCover = [];
    const coverExtension = extname(req.files.cover[0].originalname);

    await Jimp.read(cover)
      .then((image) => {
        image.scaleToFit(830, 830);
        image.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-${pictureName}${coverExtension}`));
        req.body.cover = `the-hub-post-cover-${pictureName}${coverExtension}`;
      })
      .catch((err) => console.log(err));
  }

  if (req.files.stepCover) {
    req.files.stepCover.map(async (item, index) => {
      const stepCover = resolve(__dirname, '..', '..', '..', 'tmp', item.filename);
      const itemExtension = extname(item.originalname);

      await Jimp.read(stepCover)
        .then((image) => {
          image.scaleToFit(830, 830);
          image.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`));
          req.body.stepCover[index] = `the-hub-post-cover-step-${index}-${pictureName}${itemExtension}`;
        })
        .catch((err) => console.log(err));
    });
  }

  next();
};
