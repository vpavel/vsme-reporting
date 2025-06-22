// backend/src/controllers/pdfController.ts
import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { asyncHandler } from "../utils/asyncHandler";
import { GeneralInfo } from "../models/GeneralInfo";
import { FormType } from "../types/forms";
import { AppError } from "../utils/errorHandler";

// Define form items (same as your frontend constants)
const b1FormItems = [
  {
    id: "b1.1",
    description:
      "Have you omitted any disclosures due to sensitive or classified information? If yes, specify which ones and provide the justification.",
  },
  {
    id: "b1.2",
    description:
      "Is your sustainability report prepared on a consolidated basis (including subsidiaries) or on an individual basis?",
  },
  {
    id: "b1.3",
    description:
      "If reporting on a consolidated basis, please list all subsidiaries included in the report along with their registered addresses.",
  },
  {
    id: "b1.4",
    description: "What is the legal form of your company (e.g., LLC, corporation, partnership)?",
  },
  {
    id: "b1.5",
    description: "Please provide your company's NACE sector classification code(s).",
  },
  {
    id: "b1.6",
    description: "What is your company's total balance sheet size in Euros (EUR)?",
  },
  {
    id: "b1.7",
    description: "What was your company's total turnover (revenue) in Euros (EUR) in the reporting year?",
  },
  {
    id: "b1.8",
    description: "How many employees does your company have (in headcount or full-time equivalent - FTE)?",
  },
  {
    id: "b1.9",
    description: "In which country is your company's primary operation located?",
  },
  {
    id: "b1.10",
    description: "Where are your company's significant assets primarily located? (Specify the country/countries)",
  },
  {
    id: "b1.11",
    description: "Provide the geolocation (latitude and longitude) of sites owned, leased, or managed by your company.",
  },
  {
    id: "b1.12",
    description:
      "Does your company hold any sustainability-related certifications or labels? If yes, please list them along with issuer, date, and rating/score.",
  },
];

const b2FormItems = [
  {
    id: "b2.1",
    description:
      "What specific practices does your company have in place to reduce water consumption, energy use, or greenhouse gas emissions? Please briefly describe each practice.",
  },
  {
    id: "b2.2",
    description:
      "Does your company have formal sustainability policies? If yes, please list and briefly describe them.",
  },
  {
    id: "b2.3",
    description: "Are your sustainability policies publicly available? If yes, where (e.g., company website link)?",
  },
  {
    id: "b2.4",
    description:
      "What future initiatives or plans does your company have to enhance sustainability (e.g., planned projects, investments, or strategic changes)?",
  },
  {
    id: "b2.5",
    description: "Does your company set specific sustainability targets? If yes, briefly describe each target.",
  },
  {
    id: "b2.6",
    description:
      "How do you monitor progress towards these targets (describe monitoring methods, tools, or indicators)? Provide quantitative progress against each target (if available).",
  },
];

interface PdfGenerationOptions {
  companyName?: string;
  reportingYear?: string;
  generatedBy?: string;
}

export class PdfController {
  static generateGeneralInfoReport = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { companyName, reportingYear } = req.query as { companyName?: string; reportingYear?: string };

    // Fetch B1 and B2 forms for the user
    const [b1Form, b2Form] = await Promise.all([
      GeneralInfo.findOne({ userId, formType: FormType.GENERAL_INFO_B1 }),
      GeneralInfo.findOne({ userId, formType: FormType.GENERAL_INFO_B2 }),
    ]);

    if (!b1Form && !b2Form) {
      throw new AppError("No general information forms found for this user", 404);
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
    });

    // Set response headers
    const filename = `VSME-General-Info-Report-${userId}-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Generate PDF content
    await generatePdfContent(doc, {
      b1Data: b1Form?.data || {},
      b2Data: b2Form?.data || {},
      companyName: companyName || "Your Company",
      reportingYear: reportingYear || new Date().getFullYear().toString(),
      generatedBy: userId,
    });

    doc.end();
  });
}

async function generatePdfContent(
  doc: PDFKit.PDFDocument,
  data: {
    b1Data: Record<string, any>;
    b2Data: Record<string, any>;
    companyName: string;
    reportingYear: string;
    generatedBy: string;
  }
) {
  const { b1Data, b2Data, companyName, reportingYear } = data;

  // Colors and styling
  const colors = {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#059669",
    text: "#1f2937",
    background: "#f8fafc",
  };

  // Page dimensions
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let yPosition = margin;

  // Helper functions
  function addNewPageIfNeeded(requiredSpace: number = 100): boolean {
    if (yPosition + requiredSpace > pageHeight - margin - 50) {
      // Add more buffer
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  }

  function addHeader(text: string, size: number = 16, color: string = colors.primary) {
    // Only add new page if we really need it
    if (yPosition + size + 20 > pageHeight - margin - 50) {
      doc.addPage();
      yPosition = margin;
    }
    doc.fillColor(color).fontSize(size).font("Helvetica-Bold").text(text, margin, yPosition);
    yPosition += size + 10;
  }

  function addText(text: string, size: number = 11, color: string = colors.text, indent: number = 0) {
    const options = {
      width: contentWidth - indent,
      align: "left" as const,
    };

    const textHeight = doc.heightOfString(text, options);

    // Only add new page if text won't fit
    if (yPosition + textHeight + 10 > pageHeight - margin - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc
      .fillColor(color)
      .fontSize(size)
      .font("Helvetica")
      .text(text, margin + indent, yPosition, options);

    yPosition += textHeight + 5;
  }

  function addDivider() {
    // Only add new page if divider won't fit
    if (yPosition + 20 > pageHeight - margin - 50) {
      doc.addPage();
      yPosition = margin;
    }
    doc
      .strokeColor(colors.secondary)
      .lineWidth(1)
      .moveTo(margin, yPosition)
      .lineTo(pageWidth - margin, yPosition)
      .stroke();
    yPosition += 15;
  }

  // Title Page
  doc
    .fillColor(colors.primary)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("VSME Sustainability Report", margin, yPosition + 50, { align: "center" });

  yPosition += 120;

  doc
    .fillColor(colors.text)
    .fontSize(18)
    .font("Helvetica")
    .text("General Information Section", margin, yPosition, { align: "center" });

  yPosition += 60;

  doc.fontSize(14).text(`Company: ${companyName}`, margin, yPosition, { align: "center" });
  yPosition += 25;

  doc.text(`Reporting Year: ${reportingYear}`, margin, yPosition, { align: "center" });
  yPosition += 25;

  doc
    .fontSize(12)
    .fillColor(colors.secondary)
    .text(
      `Generated on: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      margin,
      yPosition,
      { align: "center" }
    );

  // Add new page for Table of Contents
  doc.addPage();
  yPosition = margin;

  // Table of Contents - calculate actual pages more accurately
  addHeader("Table of Contents", 20);
  yPosition += 10;

  // Estimate pages more accurately based on content
  const estimatePages = () => {
    const itemsPerPage = 4; // Rough estimate of Q&A pairs per page
    const b1Pages = Math.ceil(b1FormItems.length / itemsPerPage);
    const b2Pages = Math.ceil(b2FormItems.length / itemsPerPage);

    return {
      b1Start: 3,
      b2Start: 3 + b1Pages,
    };
  };

  const pageEstimates = estimatePages();

  const tocEntries = [
    { title: "B1 - Basis for Preparation", page: pageEstimates.b1Start },
    { title: "B2 - Practices, Policies and Future Initiatives", page: pageEstimates.b2Start },
  ];

  tocEntries.forEach((entry) => {
    // Check if TOC entry fits on current page
    if (yPosition + 25 > pageHeight - margin - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc
      .fillColor(colors.text)
      .fontSize(12)
      .font("Helvetica")
      .text(entry.title, margin + 20, yPosition);

    // Add dotted line
    const titleWidth = doc.widthOfString(entry.title);
    const dotsStart = margin + 20 + titleWidth + 10;
    const dotsEnd = pageWidth - margin - 30;
    const dotsWidth = dotsEnd - dotsStart;
    const dotCount = Math.floor(dotsWidth / 5);

    doc.fillColor(colors.secondary);
    for (let i = 0; i < dotCount; i++) {
      doc.circle(dotsStart + i * 5, yPosition + 6, 0.5).fill();
    }

    doc.fillColor(colors.text).text(`${entry.page}`, dotsEnd, yPosition);

    yPosition += 20;
  });

  // Add new page for content
  doc.addPage();
  yPosition = margin;

  // B1 Section
  if (Object.keys(b1Data).length > 0) {
    addHeader("B1 - Basis for Preparation", 20);
    addText(
      "This section covers the fundamental information about your company and the basis for preparing this sustainability report.",
      12,
      colors.secondary
    );
    addDivider();

    b1FormItems.forEach((item, index) => {
      const answer = b1Data[item.id] || "Not provided";
      const questionHeight = doc.heightOfString(item.description, { width: contentWidth - 20 });
      const answerHeight = doc.heightOfString(answer, { width: contentWidth - 20 });
      const totalItemHeight = questionHeight + answerHeight + 60; // Approximate total height needed

      // Only add new page if this entire item won't fit
      if (yPosition + totalItemHeight > pageHeight - margin - 50) {
        doc.addPage();
        yPosition = margin;
      }

      // Question number and title
      doc
        .fillColor(colors.primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`${item.id.toUpperCase()}`, margin, yPosition);

      yPosition += 15;

      // Question description
      doc
        .fillColor(colors.text)
        .fontSize(11)
        .font("Helvetica")
        .text(item.description, margin + 10, yPosition, {
          width: contentWidth - 20,
          align: "left",
        });

      yPosition += questionHeight + 10;

      // Answer
      doc
        .fillColor(colors.accent)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Answer:", margin + 10, yPosition);

      yPosition += 12;

      doc
        .fillColor(colors.text)
        .fontSize(10)
        .font("Helvetica")
        .text(answer, margin + 10, yPosition, {
          width: contentWidth - 20,
          align: "left",
        });

      yPosition += answerHeight + 15;

      // Add separator line for better readability
      if (index < b1FormItems.length - 1) {
        doc
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .moveTo(margin + 10, yPosition)
          .lineTo(pageWidth - margin - 10, yPosition)
          .stroke();
        yPosition += 10;
      }
    });
  }

  // B2 Section
  if (Object.keys(b2Data).length > 0) {
    // Add some space before B2 section, but don't force a new page
    yPosition += 30;

    // Only add new page if header won't fit
    if (yPosition + 60 > pageHeight - margin - 50) {
      doc.addPage();
      yPosition = margin;
    }

    addHeader("B2 - Practices, Policies and Future Initiatives", 20);
    addText(
      "This section focuses on your company's current sustainability practices and future plans for transitioning towards a more sustainable economy.",
      12,
      colors.secondary
    );
    addDivider();

    b2FormItems.forEach((item, index) => {
      const answer = b2Data[item.id] || "Not provided";
      const questionHeight = doc.heightOfString(item.description, { width: contentWidth - 20 });
      const answerHeight = doc.heightOfString(answer, { width: contentWidth - 20 });
      const totalItemHeight = questionHeight + answerHeight + 60; // Approximate total height needed

      // Only add new page if this entire item won't fit
      if (yPosition + totalItemHeight > pageHeight - margin - 50) {
        doc.addPage();
        yPosition = margin;
      }

      // Question number and title
      doc
        .fillColor(colors.primary)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`${item.id.toUpperCase()}`, margin, yPosition);

      yPosition += 15;

      // Question description
      doc
        .fillColor(colors.text)
        .fontSize(11)
        .font("Helvetica")
        .text(item.description, margin + 10, yPosition, {
          width: contentWidth - 20,
          align: "left",
        });

      yPosition += questionHeight + 10;

      // Answer
      doc
        .fillColor(colors.accent)
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Answer:", margin + 10, yPosition);

      yPosition += 12;

      doc
        .fillColor(colors.text)
        .fontSize(10)
        .font("Helvetica")
        .text(answer, margin + 10, yPosition, {
          width: contentWidth - 20,
          align: "left",
        });

      yPosition += answerHeight + 15;

      // Add separator line for better readability
      if (index < b2FormItems.length - 1) {
        doc
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .moveTo(margin + 10, yPosition)
          .lineTo(pageWidth - margin - 10, yPosition)
          .stroke();
        yPosition += 10;
      }
    });
  }

  // Add page numbers and footer
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    // Footer
    doc
      .fontSize(8)
      .fillColor(colors.secondary)
      .text(`VSME Sustainability Report - ${companyName}`, margin, pageHeight - 30, { align: "left" })
      .text(`Page ${i + 1} of ${pageCount}`, margin, pageHeight - 30, { align: "right" });
  }
}
