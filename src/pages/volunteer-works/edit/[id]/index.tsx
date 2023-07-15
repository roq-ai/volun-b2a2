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
import { getVolunteerWorkById, updateVolunteerWorkById } from 'apiSdk/volunteer-works';
import { Error } from 'components/error';
import { volunteerWorkValidationSchema } from 'validationSchema/volunteer-works';
import { VolunteerWorkInterface } from 'interfaces/volunteer-work';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { NonprofitInterface } from 'interfaces/nonprofit';
import { getNonprofits } from 'apiSdk/nonprofits';

function VolunteerWorkEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<VolunteerWorkInterface>(
    () => (id ? `/volunteer-works/${id}` : null),
    () => getVolunteerWorkById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: VolunteerWorkInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateVolunteerWorkById(id, values);
      mutate(updated);
      resetForm();
      router.push('/volunteer-works');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<VolunteerWorkInterface>({
    initialValues: data,
    validationSchema: volunteerWorkValidationSchema,
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
            Edit Volunteer Work
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
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="reward_points" mb="4" isInvalid={!!formik.errors?.reward_points}>
              <FormLabel>Reward Points</FormLabel>
              <NumberInput
                name="reward_points"
                value={formik.values?.reward_points}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('reward_points', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.reward_points && <FormErrorMessage>{formik.errors?.reward_points}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<NonprofitInterface>
              formik={formik}
              name={'nonprofit_id'}
              label={'Select Nonprofit'}
              placeholder={'Select Nonprofit'}
              fetcher={getNonprofits}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
    entity: 'volunteer_work',
    operation: AccessOperationEnum.UPDATE,
  }),
)(VolunteerWorkEditPage);
