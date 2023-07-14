const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { authService, userService, tokenService } = require('./auth.service');
const { sendResponse } = require('../../utils/responseHandler');

const register = catchAsync(async (req, res) => {

  try {
    const { email, password, name, role } = req.body;
    let roleOfUser = role ? role : 'user';

    let userObj = {
      email,
      password,
      name,
      role: roleOfUser,
    };
    const user = await authService.singup(userObj);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    console.error("Error in registration", error);
  }

});

const singup = catchAsync(async (req, res) => {

  try {
    const { email, password, name } = req.body;

    let userObj = {
      email,
      password,
      name,
      role: 'user',
    };

    const user = await authService.singup(userObj);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    console.error("Error in registration", error);
  }

});

const adminHost = process.env.adminHost
const login = catchAsync(async (req, res) => {
  const { email, password, phoneNumber } = req.body;
    let reqOrigin = req.headers && req.headers.origin ? new URL(req.headers.origin) : ''
    let isAdmin = reqOrigin.host == adminHost
    const user = await authService.loginUserWithEmailAndPassword(email, password, phoneNumber, isAdmin);
    /* INFO: Send error message in data directly just like below to maintain consistensy in APP */
    if(user && !user.user){
      sendResponse(res, httpStatus.FORBIDDEN, null,user.msg);
      return;
    }
    const tokens = await tokenService.generateAuthTokens(user.user);
    sendResponse(res, httpStatus.OK, { user:user.user, tokens }, null);
});

const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.adminLoginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  sendResponse(res, httpStatus.OK, { user, tokens }, null);
});


const getCurrentUser = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;
    const userRes = await authService.getCurrentUser(token);
    if (userRes.status) {
      res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        status:true,
        data: { userData: userRes.userData, profileData:userRes.profileData }
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        status:false,
        data: 'something went wrong',
      });
    }
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      data: err.message,
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  getCurrentUser,
  adminLogin,
  singup
};
