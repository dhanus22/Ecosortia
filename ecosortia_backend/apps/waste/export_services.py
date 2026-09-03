from io import BytesIO
from openpyxl import Workbook
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_report_pdf(report):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4
    y = height - 50

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, y, "EcoSortia Waste Report")
    y -= 35

    pdf.setFont("Helvetica", 11)

    fields = [
        ("Report ID", report.id),
        ("Title", report.title),
        ("Citizen", report.user.username),
        ("Waste Type", report.waste_type),
        ("Status", report.status),
        ("Address", report.address),
        ("Latitude", report.latitude),
        ("Longitude", report.longitude),
        ("Credits Awarded", report.credits_awarded),
        ("Submitted", report.created_at.strftime("%d %b %Y, %I:%M %p")),
    ]

    for label, value in fields:
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y, f"{label}:")
        pdf.setFont("Helvetica", 10)
        pdf.drawString(150, y, str(value))
        y -= 22

    if report.description:
        y -= 10
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y, "Description:")
        y -= 18
        pdf.setFont("Helvetica", 10)

        for line in report.description.splitlines():
            pdf.drawString(50, y, line[:100])
            y -= 15

    if report.admin_remarks:
        y -= 10
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(50, y, "Municipality Remarks:")
        y -= 18
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, y, report.admin_remarks[:100])

    pdf.save()
    buffer.seek(0)
    return buffer


def generate_reports_excel(reports):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Waste Reports"

    headers = [
        "ID",
        "Citizen",
        "Title",
        "Description",
        "Waste Type",
        "Status",
        "Address",
        "Latitude",
        "Longitude",
        "Credits Awarded",
        "Admin Remarks",
        "Created At",
        "Completed At",
    ]

    sheet.append(headers)

    for report in reports:
        sheet.append([
            report.id,
            report.user.username,
            report.title,
            report.description,
            report.waste_type,
            report.status,
            report.address,
            float(report.latitude),
            float(report.longitude),
            report.credits_awarded,
            report.admin_remarks or "",
            report.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            report.completed_at.strftime("%Y-%m-%d %H:%M:%S")
            if report.completed_at else "",
        ])

    for column in sheet.columns:
        max_length = max(len(str(cell.value or "")) for cell in column)
        sheet.column_dimensions[column[0].column_letter].width = min(
            max_length + 2, 40
        )

    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    return buffer