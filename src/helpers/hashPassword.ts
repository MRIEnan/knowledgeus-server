import bcrypt from 'bcrypt';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import config from '../config';

const hashPassword = async (givenPassword: string) => {
  try {
    const ans = await bcrypt.hash(
      givenPassword,
      Number(config.bcrypt_salt_rounds),
    );
    return ans;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Block in process.');
  }
};

export default hashPassword;
