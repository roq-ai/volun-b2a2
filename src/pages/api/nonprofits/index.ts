import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { nonprofitValidationSchema } from 'validationSchema/nonprofits';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getNonprofits();
    case 'POST':
      return createNonprofit();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNonprofits() {
    const data = await prisma.nonprofit
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'nonprofit'));
    return res.status(200).json(data);
  }

  async function createNonprofit() {
    await nonprofitValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.volunteer_work?.length > 0) {
      const create_volunteer_work = body.volunteer_work;
      body.volunteer_work = {
        create: create_volunteer_work,
      };
    } else {
      delete body.volunteer_work;
    }
    const data = await prisma.nonprofit.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
