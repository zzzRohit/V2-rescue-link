import { AnimalType } from "../../../generated/prisma/client.js";
import { prisma } from "../../prisma/client.js";
import { generateTrackingId } from "../../utils/trackingId.js";

type CreateReportInput = {
  title: string;
  animalType: AnimalType;
  description: string;
  phoneNumber?: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
};

export const createReport = async (reportData: CreateReportInput) => {
  try {
    const trackingId = generateTrackingId();

    const report = await prisma.report.create({
      data: {
        trackingId,
        title: reportData.title,
        animalType: reportData.animalType,
        description: reportData.description,
        phoneNumber: reportData.phoneNumber ?? null,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        imageUrl: reportData.imageUrl,
      },
    });

    return {
      trackingId: report.trackingId,
    };
  } catch (error) {
  console.dir(error, { depth: null });

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  }

  throw error;
}
};
