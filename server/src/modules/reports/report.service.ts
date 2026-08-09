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
  reporterId: string | undefined; // Optional reporterId field
};

export const createReport = async (reportData: CreateReportInput, reporterId: string | undefined) => {
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
        reporterId: reporterId ?? null,
      },
    });

    return {
      trackingId: report.trackingId,
    };

};
export const getMyReports = async (userId: string) => {
    const reports = await prisma.report.findMany({
      where: {
        reporterId: userId,
      },
    });

    return reports;
  
};