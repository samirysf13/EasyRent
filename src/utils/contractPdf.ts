import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface ContractPdfData {
  contractNumber: string
  customerName: string
  phone: string
  idNumber: string
  carName: string
  carPlate: string
  days: number
  dailyPrice: number
  total: number
  startDate: string
  endDate: string
}

export async function generateAndDownloadContractPdf(
  element: HTMLElement,
  contractNumber: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  if (imgHeight > pageHeight) {
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight)
    const remainingHeight = imgHeight - pageHeight
    if (remainingHeight > 0) {
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, -pageHeight, imgWidth, imgHeight)
    }
  } else {
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
  }

  pdf.save(`${contractNumber}.pdf`)
}
