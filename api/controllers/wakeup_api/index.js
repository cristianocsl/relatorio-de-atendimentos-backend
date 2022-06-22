const { OK } = require('http-status-codes').StatusCodes;

module.exports.wakeup = async (_req, res) => {
  try {
    return res.status(OK).json('Wakeup done!');
  } catch (err) { console.log(err); }
};
