import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { volunteerWorkValidationSchema } from 'validationSchema/volunteer-works';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.volunteer_work
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getVolunteerWorkById();
    case 'PUT':
      return updateVolunteerWorkById();
    case 'DELETE':
      return deleteVolunteerWorkById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVolunteerWorkById() {
    const data = await prisma.volunteer_work.findFirst(convertQueryToPrismaUtil(req.query, 'volunteer_work'));
    return res.status(200).json(data);
  }

  async function updateVolunteerWorkById() {
    await volunteerWorkValidationSchema.validate(req.body);
    const data = await prisma.volunteer_work.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteVolunteerWorkById() {
    const data = await prisma.volunteer_work.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
