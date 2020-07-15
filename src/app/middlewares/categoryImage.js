import Jimp from 'jimp';
import URLSlugify from 'url-slugify';
import { resolve, extname } from 'path';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import clean from 'gulp-clean';

const urlSlugify = new URLSlugify();

export default (req, res, next) => {
  const img = resolve(__dirname, '..', '..', '..', 'tmp', req.file.filename);

  const pictureName = urlSlugify.slugify(req.body.title);
  const extension = extname(req.file.originalname);

  gulp.src(img)
    .pipe(imagemin())
    .pipe(gulp.dest(resolve(__dirname, '..', '..', '..', 'tmp')));

  Jimp.read(img)
    .then((image) => {
      image.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-category-${pictureName}${extension}`));
      image.scaleToFit(830, 830);
      image.crop(205, 0, 450, 550);
      image.write(resolve(__dirname, '..', '..', '..', 'uploads', `the-hub-category-small-${pictureName}${extension}`));
      req.body.cover = `the-hub-category-${pictureName}${extension}`;
      req.body.coverSmall = `the-hub-category-small-${pictureName}${extension}`;
      gulp.src(resolve(__dirname, '..', '..', '..', 'tmp')).pipe(clean());
      next();
    })
    .catch((err) => res.json(err));
};
