import { AnimalType } from "../../../generated/prisma/client.js";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/Apperror.js";
import { generateTrackingId } from "../../utils/trackingId.js";
import { calculateDistanceKm } from "../../utils/distance.js";
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

export const createReport = async (
  reportData: CreateReportInput,
  reporterId: string | undefined,
) => {
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
export const getAvailableReports = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.latitude === null || user.longitude === null) {
    throw new AppError(
      "Rescuer location is not available update location before fetching reports",
      400,
    );
  }
  const radiusKm = user.serviceRadiusKm ?? 5;
  // Default radius is 5 km if not set

  const latDelta = radiusKm / 111;
  const latRadians = (user.latitude * Math.PI) / 180;
  const lonDelta = radiusKm / (111 * Math.cos(latRadians));
  const report = await prisma.report.findMany({
    where: {
      status: "PENDING",
      latitude: {
        gte: user.latitude - latDelta,
        lte: user.latitude + latDelta,
      },
      longitude: {
        gte: user.longitude - lonDelta,
        lte: user.longitude + lonDelta,
      },
    },
  });
  const availableReports = report.map((report) => {
    const distanceKm = calculateDistanceKm(
      user.latitude!,
      user.longitude!,
      report.latitude,
      report.longitude,
    );

    return {
      ...report,
      distanceKm,
    };
  }).filter((report) => report.distanceKm <= radiusKm);

  return availableReports;
};
