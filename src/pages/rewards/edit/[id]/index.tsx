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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRewardById, updateRewardById } from 'apiSdk/rewards';
import { Error } from 'components/error';
import { rewardValidationSchema } from 'validationSchema/rewards';
import { RewardInterface } from 'interfaces/reward';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function RewardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RewardInterface>(
    () => (id ? `/rewards/${id}` : null),
    () => getRewardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RewardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRewardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rewards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RewardInterface>({
    initialValues: data,
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
            Edit Reward
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(RewardEditPage);
