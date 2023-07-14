const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const { uploadFile } = require('../../utils/fileUpload');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/upload-file').post(uploadFile);


/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
