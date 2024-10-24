const mongoose = require("mongoose");
const Campaign = require("../Models/CampaignSchema");
const Lead = require("../Models/LeadSchema");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { runETLProcess, generateCSVReport,generatePDFReport } = require("../Config/Transform");
const SimpleRoute = (req, res) => {
    res.send("Hii");
};

const CreateLead = async (req, res) => {
    try {
        const { name, email, phone, source, campaignId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(campaignId)) {
            return res.status(400).json({ error: "Invalid Campaign ID format" });
        }

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.send(404).json({ error: "Campaign Not Found" });
        }

        const newLead = new Lead({ name, email, phone, source, campaign });

        await newLead.save();

        res.status(201).json({
            message: "New Lead Added Successfully",
            lead: newLead,
        });
    } catch (error) {
        console.error("Error adding lead:", error); // Log the error
        res.status(500).json({ error: "Failed to add Lead" });
    }
};

const CreateCampaign = async (req, res) => {
    try {
        const { name, budget } = req.body;
        const newCampaign = new Campaign({ name, budget });
        await newCampaign.save();
        res.status(201).json({
            message: "New Campaign Added Successfully",
            campaign: newCampaign,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to add Campaign" });
    }
};

const GetLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate("campaign");
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: "Failed to get Campaigns" });
    }
};

const GetCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ error: "Failed to get Campaigns" });
    }
};

const GenerateReport = async (req, res) => {
    const format = req.query.format || 'csv'; 
    const metrics = await runETLProcess();
    try {
        if (format === 'csv') {
            await generateCSVReport(metrics);
            res.download('report.csv', (err) => {
                if (err) res.status(500).send('Error downloading CSV report');
            });
        } else if (format === 'pdf') {
            // Generate PDF report
            const pdfPath = 'report.pdf';
            await generatePDFReport(metrics, pdfPath);
            res.download(pdfPath, (err) => {
                if (err) res.status(500).send('Error downloading PDF report');
            });
        } else {
            res.status(400).send('Invalid format. Supported formats: csv, pdf');
        }
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).send("Error generating report: " + error.message);
    }
};

module.exports = {
    SimpleRoute,
    CreateLead,
    CreateCampaign,
    GetLeads,
    GetCampaigns,
    GenerateReport,
};
