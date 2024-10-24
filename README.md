# Lead and Campaign Report Generator

This project is a Node.js-based application that generates reports based on leads and campaigns. The reports can be generated in CSV or PDF format. The API provides functionality to group leads by source and campaign, sort campaigns by budget, and export the results in either format.

## Features

- Generate a CSV report of lead sources and campaign details.
- Generate a PDF report containing similar information.
- Supports customizable report formats through query parameters.

## Technologies Used

- **Node.js**: Backend framework.
- **Express.js**: For creating the API.
- **MongoDB**: Database for storing lead and campaign information.
- **fast-csv**: Library for generating CSV files.
- **PDFKit**: Library for generating PDF files.

## API Endpoints

### 1. Create Lead
#### [http://localhost:3000/api/v1/create/lead](http://localhost:3000/api/v1/create/lead)
```
json: {
    "name": "Aditya  Shukla",
    "email": "adi@example.com",
    "phone": "123-456-7890",
    "source": "Youtube Ads",
    "campaignId": "671a165e9595c4feb621176e"
  }
```

### 2. Create Campaign
#### [http://localhost:3000/api/v1/create/lead](http://localhost:3000/api/v1/create/campaign)
```
json: {"name": "Campaign B", "budget": 39000 }
```

### 3. Get All Campaigns
#### [http://localhost:3000/api/v1/get/campaigns](http://localhost:3000/api/v1/get/campaigns)


### 4. Get All Leads
#### [http://localhost:3000/api/v1/get/leads](http://localhost:3000/api/v1/get/leads)

### 4. Get Generate Report Csv or Pdf
#### [http://localhost:3000/api/v1/get/generate-report?format=pdf](http://localhost:3000/api/v1/get/generate-report?format=pdf) or csv 

This request will generate and download a `report.pdf` file.

#### Response
The API will return a downloadable file (either `report.csv` or `report.pdf`).

### 2. Example Output

The CSV and PDF reports include data on:

- **Leads by Source**: Aggregated count of leads from different sources.
- **Sorted Campaigns by Budget**: Campaigns sorted in descending order based on their budget.

## How to Run the Project

1. Clone the repository:
```bash
git clone https://github.com/ShadowAdi/EzyMetricsAssignment.git
```

2. Navigate to the project:
```bash
cd into folder 
```

3. Install Dependencies:
```bash
npm install
```

4. Setup Mongo Connection
5. Start the server
```bash
npm start
```
