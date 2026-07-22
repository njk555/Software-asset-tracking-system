const prisma = require("../prisma/client");

const getDashboard = async () => {
  const [
    assetCount,
    vendorCount,
    categoryCount,
    locationCount,
    departmentCount,
    employeeCount,

    openTicketCount,
    activeAmcCount,
    expiringAmcCount,
    notificationCount,

    recentAssets,
  ] = await Promise.all([
    // Existing Counts
    prisma.asset.count(),
    prisma.vendor.count(),
    prisma.assetCategory.count(),
    prisma.location.count(),
    prisma.department.count(),
    prisma.employee.count(),

    // Open Helpdesk Tickets
    prisma.ticket.count({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    }),

    // Active AMC Contracts
    prisma.amcContract.count({
      where: {
        status: "ACTIVE",
      },
    }),

    // AMC Expiring Within 60 Days
    prisma.amcContract.count({
      where: {
        status: "ACTIVE",
        expiryDate: {
          gte: new Date(),
          lte: new Date(
            Date.now() + 60 * 24 * 60 * 60 * 1000
          ),
        },
      },
    }),

    // Unread AMC Notifications
    prisma.amcNotification.count({
      where: {
        isRead: false,
      },
    }),

    // Recent Assets
    prisma.asset.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        vendor: true,
        location: true,
      },
    }),
  ]);

  return {
    counts: {
      assets: assetCount,
      vendors: vendorCount,
      categories: categoryCount,
      locations: locationCount,
      departments: departmentCount,
      employees: employeeCount,

      openTickets: openTicketCount,
      activeAmc: activeAmcCount,
      expiringAmc: expiringAmcCount,
      notifications: notificationCount,
    },

    recentAssets,
  };
};

module.exports = {
  getDashboard,
};