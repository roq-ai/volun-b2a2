import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createReward } from 'apiSdk/rewards';
import { Error } from 'components/error';
import { rewardValidationSchema } from 'validationSchema/rewards';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { RewardInterface } from 'interfaces/reward';

function RewardCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RewardInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createReward(values);
      resetForm();
      router.push('/rewards');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RewardInterface>({
    initialValues: {
      points: 0,
      coupon_code: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: rewardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Reward
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="points" mb="4" isInvalid={!!formik.errors?.points}>
            <FormLabel>Points</FormLabel>
            <NumberInput
              name="points"
              value={formik.values?.points}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('points', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.points && <FormErrorMessage>{formik.errors?.points}</FormErrorMessage>}
          </FormControl>
          <FormControl id="coupon_code" mb="4" isInvalid={!!formik.errors?.coupon_code}>
            <FormLabel>Coupon Code</FormLabel>
            <Input type="text" name="coupon_code" value={formik.values?.coupon_code} onChange={formik.handleChange} />
            {formik.errors.coupon_code && <FormErrorMessage>{formik.errors?.coupon_code}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'reward',
    operation: AccessOperationEnum.CREATE,
  }),
)(RewardCreatePage);
