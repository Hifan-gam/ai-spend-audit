import { jsPDF } from 'jspdf'

type Recommendation = {
  title: string
  description: string
  monthlySavings: number
  actionItems: string[]
}

type ExportAuditData = {
  id: string
  totalMonthlySpend: number
  totalMonthlySavings: number
  totalYearlySavings: number
  aiSummary: string
  recommendations: Recommendation[]
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)

export const exportAuditAsPdf = (
  reportTitle: string,
  filenamePrefix: string,
  audit: ExportAuditData
) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const left = 50
  const right = pageWidth - 50
  const maxWidth = right - left
  let y = 56

  const ensureSpace = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 56) {
      doc.addPage()
      y = 56
    }
  }

  const addHeading = (text: string) => {
    ensureSpace(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(text, left, y)
    y += 22
  }

  const addBody = (text: string, spacing = 18) => {
    const safeText = text || '-'
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(safeText, maxWidth)
    ensureSpace(lines.length * 14 + 6)
    doc.text(lines, left, y)
    y += lines.length * 14 + spacing
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(reportTitle, left, y)
  y += 24

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Report ID: ${audit.id}`, left, y)
  y += 16
  doc.text(`Exported: ${new Date().toLocaleString()}`, left, y)
  y += 26

  addHeading('Summary')
  addBody(`Current Monthly Spend: ${formatCurrency(audit.totalMonthlySpend)}`, 10)
  addBody(`Estimated Monthly Savings: ${formatCurrency(audit.totalMonthlySavings)}`, 10)
  addBody(`Estimated Yearly Savings: ${formatCurrency(audit.totalYearlySavings)}`, 18)

  if (audit.aiSummary) {
    addHeading('AI Analysis')
    addBody(audit.aiSummary, 16)
  }

  addHeading('Recommendations')

  if (audit.recommendations.length === 0) {
    addBody('No recommendations available.')
  } else {
    audit.recommendations.forEach((rec, index) => {
      addHeading(`${index + 1}. ${rec.title}`)
      addBody(rec.description, 10)
      addBody(`Monthly Savings: ${formatCurrency(rec.monthlySavings)}`, 10)

      if (rec.actionItems.length > 0) {
        addBody('Action Items:', 8)
        rec.actionItems.forEach((item) => {
          addBody(`- ${item}`, 6)
        })
      }

      y += 6
    })
  }

  doc.save(`${filenamePrefix}-${audit.id}.pdf`)
}
