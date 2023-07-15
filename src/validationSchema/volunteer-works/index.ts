import * as yup from 'yup';

export const volunteerWorkValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  reward_points: yup.number().integer().required(),
  nonprofit_id: yup.string().nullable(),
});
