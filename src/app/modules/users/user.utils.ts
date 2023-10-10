import { User } from './user.model';

export const generateUserId = async (): Promise<string> => {
  const result = (await User.find({}).countDocuments()) + 1;
  const resData = result.toString().padStart(8, '0');
  return String(`uKnow${resData}`);
};
