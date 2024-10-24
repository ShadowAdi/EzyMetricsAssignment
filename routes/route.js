const express = require("express")
const Lead = require("../Models/LeadSchema")
const Campaign = require("../Models/CampaignSchema")
const { SimpleRoute, CreateLead, CreateCampaign, GetLeads, GetCampaigns, GenerateReport, } = require("../controllers/controller")
const router = express.Router()


router.get("/", SimpleRoute)
router.post("/create/lead", CreateLead)
router.post("/create/campaign", CreateCampaign)
router.get("/get/leads", GetLeads)
router.get("/get/campaigns", GetCampaigns)
router.get("/get/generate-report", GenerateReport)




module.exports = router