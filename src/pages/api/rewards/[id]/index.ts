import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { rewardValidationSchema } from 'validationSchema/rewards';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.reward
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRewardById();
    case 'PUT':
      return updateRewardById();
    case 'DELETE':
      return deleteRewardById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRewardById() {
    const data = await prisma.reward.findFirst(convertQueryToPrismaUtil(req.query, 'reward'));
    return res.status(200).json(data);
  }

  async function updateRewardById() {
    await rewardValidationSchema.validate(req.body);
    const data = await prisma.reward.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRewardById() {
    const data = await prisma.reward.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
