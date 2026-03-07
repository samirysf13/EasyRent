import React from 'react'
import type { ContractPdfData } from '../utils/contractPdf'

interface Props {
  data: ContractPdfData
}

export function ContractPdfContent({ data }: Props) {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', sans-serif",
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>عقد تأجير سيارة</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>مكتب إيزي رينت لتأجير السيارات</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>رقم العقد</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.contractNumber}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>تاريخ البدء</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.startDate}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>تاريخ الانتهاء</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.endDate}</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>بيانات العميل</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, width: '40%' }}>الاسم الكامل</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.customerName}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>رقم الهاتف</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.phone || '—'}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>رقم الهوية</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.idNumber || '—'}</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>بيانات السيارة</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, width: '40%' }}>السيارة والموديل</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.carName}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>رقم اللوحة</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.carPlate || '—'}</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>الشروط المالية</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, width: '40%' }}>المدة (أيام)</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.days}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>السعر اليومي (د.ك)</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>{data.dailyPrice}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}>المبلغ الإجمالي (د.ك)</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: 14, fontWeight: 800 }}>{data.total}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
        يُقر الطرفان بأنهما قد اطلعا على بنود هذا العقد ووافقا عليها. هذا العقد ساري من تاريخ التوقيع.
      </p>
    </div>
  )
}
