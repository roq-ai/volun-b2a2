import * as yup from 'yup';

export const rewardValidationSchema = yup.object().shape({
  points: yup.number().integer().required(),
  coupon_code: yup.string().required(),
  user_id: yup.string().nullable(),
});
