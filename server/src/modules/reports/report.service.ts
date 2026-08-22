import { AnimalType } from "../../../generated/prisma/client.js";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/Apperror.js";
import { generateTrackingId } from "../../utils/trackingId.js";
import { calculateDistanceKm } from "../../utils/distance.js";
import { getIO } from "../../Socket.js";
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
  const io = getIO();

  const rescuers = await prisma.user.findMany({
    where: {
      role: "RESCUER",
      isAvailable: true,
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    },
  });
  for (const rescuer of rescuers) {
    const distanceKm = calculateDistanceKm(
      rescuer.latitude!,
      rescuer.longitude!,
      report.latitude,
      report.longitude,
    );

    const radiusKm = rescuer.serviceRadiusKm ?? 30;

    if (distanceKm <= radiusKm) {
      io.to(`user:${rescuer.id}`).emit("new-report", {
        message: "New animal emergency reported!",
        report: {
          id: report.id,
          trackingId: report.trackingId,
          title: report.title,
          animalType: report.animalType,
          description: report.description,
          latitude: report.latitude,
          longitude: report.longitude,
          imageUrl: report.imageUrl,
        },
        distanceKm,
      });
    }
  }

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
  const availableReports = report
    .map((report) => {
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
    })
    .filter((report) => report.distanceKm <= radiusKm);

  return availableReports;
};
export const acceptReport = async (reportId: string, userId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  const updatedReport = await prisma.report.updateMany({
    where: { id: reportId, status: "PENDING" },
    data: {
      status: "ACCEPTED",
      acceptedById: userId,
    },
  });
  if (updatedReport.count === 0) {
    throw new AppError("Report is no longer available for acceptance", 409);
  }

  return updatedReport;
};
export const completeReport = async (reportId: string, userId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });
  if (!report) {
    throw new AppError("Report not found", 404);
  }
  if (report.status !== "ACCEPTED") {
    throw new AppError("Report is not in an accepted state", 409);
  }
  if (report.acceptedById !== userId) {
    throw new AppError("You are not authorized to complete this report", 403);
  }
  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "COMPLETED",
    },
  });
  return updatedReport;
};
