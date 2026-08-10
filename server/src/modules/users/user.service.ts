import { prisma } from "../../prisma/client.js";
export const updateLocation = async (userId: string, longitude: number, latitude: number) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      longitude,
      latitude,
      locationUpdatedAt: new Date(),
    },
    select: {
      id: true,
      role: true,
      latitude: true,
      longitude: true,
      locationUpdatedAt: true,
    },
  });

  return updatedUser;
};
