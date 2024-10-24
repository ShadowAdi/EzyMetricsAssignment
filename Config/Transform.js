const fs = require("fs");
const Campaign = require("../Models/CampaignSchema");
const Lead = require("../Models/LeadSchema");
const fastcsv = require("fast-csv");
const PDFDocument = require("pdfkit");

const groupLeadsBySource = async () => {
  try {
    const leadBySource = await Lead.aggregate([
      {
        $group: {
          _id: "$source",
          totalLeads: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalLeads: -1,
        },
      },
    ]);
    return leadBySource;
  } catch (error) {
    console.error("Error grouping leads by source:", error);
  }
};

const groupLeadsByCampaign = async () => {
  try {
    const leadsByCampaign = await Lead.aggregate([
      { $group: { _id: "$campaign", totalLeads: { $sum: 1 } } },
      {
        $lookup: {
          from: "campaigns", // The name of the 'Campaign' collection
          localField: "_id",
          foreignField: "_id",
          as: "campaignDetails",
        },
      },
      { $unwind: "$campaignDetails" }, // Flatten the array from lookup
      { $sort: { "campaignDetails.budget": -1 } }, // Sort by campaign budget
    ]);
    return leadsByCampaign;
  } catch (error) {
    console.error("Error grouping leads by campaign:", error);
  }
};

const getSortedCampaignsByBudget = async () => {
  try {
    const sortedCampaigns = await Campaign.find().sort({ budget: -1 });
    return sortedCampaigns;
  } catch (error) {
    console.error("Error sorting campaigns by budget:", error);
  }
};

const runETLProcess = async () => {
  try {
    const leadsBySource = await groupLeadsBySource();
    const leadsByCampaign = await groupLeadsByCampaign();
    const sortedCampaigns = await getSortedCampaignsByBudget();
    return { leadsBySource, leadsByCampaign, sortedCampaigns };
  } catch (error) {
    console.error("ETL process failed:", error);
    throw error;
  }
};

const generateCSVReport = (metrics) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream("report.csv");

    if (!metrics || !metrics.leadsBySource) {
      return reject(new Error("No data available to generate the report."));
    }

    const data = [
      ["Source", "Total Leads"],
      ...metrics.leadsBySource.map((source) => [source._id, source.totalLeads]),
    ];

    fastcsv
      .write(data, { headers: true })
      .pipe(ws)
      .on("finish", () => {
        resolve(); // Resolve the promise once the file is fully written
      })
      .on("error", (error) => {
        reject(error); // Reject the promise if there's an error
      });
  });
};

const generatePDFReport = (metrics, pdfPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("Leads Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text("Leads by Source");
    metrics.leadsBySource.forEach((source) => {
      doc.text(`Source: ${source._id}, Total Leads: ${source.totalLeads}`);
    });

    doc.moveDown();
    doc.text("Sorted Campaigns by Budget");
    metrics.sortedCampaigns.forEach((campaign) => {
      doc.text(`Campaign: ${campaign.name}, Budget: ${campaign.budget}`);
    });

    doc.end();

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};

module.exports = {
  getSortedCampaignsByBudget,
  groupLeadsByCampaign,
  groupLeadsBySource,
  runETLProcess,
  generateCSVReport,
  generatePDFReport
};
