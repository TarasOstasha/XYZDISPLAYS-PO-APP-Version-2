import { useState } from 'react'
import { Formik } from 'formik'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './AddOption.module.scss'
import { IMPORT_OPTION_SCHEMA } from '../../utils/orderValidationSchema'
import { saveOptionsFile, exportOptionsCsv } from '../../api'
import { OPTION_DATA } from "../../utils/optionsData"
import { parseCsvFile, mergeOptionsFromCsv, REQUIRED_CSV_COLUMNS } from '../../utils/mergeOptionsFromCsv'

const CSV_FIELD_INFO = {
  id: 'Option ID (used to match / update existing options)',
  optioncatid: 'Option category ID',
  optionsdesc: 'Option / product name',
  pricediff: 'Price difference',
  vendorpricediff: 'Vendor price difference',
  optionsdesc_sidenote:
    'Encoded meta: q=quantity|sku=ProductCode|disc=discount|vendor=Vendor_PartNo',
}

const SIDENOTE_KEYS = [
  { key: 'q', mapsTo: 'quantity' },
  { key: 'sku', mapsTo: 'ProductCode' },
  { key: 'disc', mapsTo: 'discount' },
  { key: 'vendor', mapsTo: 'Vendor_PartNo' },
]

function AddOption() {
  const initialValues = {
    file: null,
  }
  const [exportStatus, setExportStatus] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleSubmit = async (values) => {
    if (!values.file) return

    const rows = await parseCsvFile(values.file);
    const merged = mergeOptionsFromCsv(OPTION_DATA, rows);
    await saveOptionsFile(merged);
  }

  const handleExport = async () => {
    setExportStatus(null)
    setIsExporting(true)
    try {
      const response = await exportOptionsCsv()
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'optionsData.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setExportStatus({ ok: true, message: 'Exported successfully' })
    } catch (e) {
      setExportStatus({ ok: false, message: e?.message || 'Export error' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.optionWrapper}>
        <h1>Import / Export Options</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={IMPORT_OPTION_SCHEMA}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            setStatus(undefined)
            try {
              await handleSubmit(values)
              setStatus({ ok: true, message: 'Uploaded successfully' })
            } catch (e) {
              setStatus({ ok: false, message: e?.message || 'Upload error' })
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
            status,
          }) => (
            <form onSubmit={handleSubmit} className={styles.importForm}>
              <label className={styles.fileLabel}>
                Attach CSV file
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null
                    setFieldValue('file', file)
                  }}
                />
              </label>

              {values.file && (
                <div className={styles.fileInfo}>
                  Selected: <b>{values.file.name}</b>
                </div>
              )}

              {touched.file && errors.file && (
                <div className={styles.error}>{String(errors.file)}</div>
              )}

              <div className={styles.actions}>
                <button type="submit" disabled={isSubmitting || !values.file}>
                  {isSubmitting ? 'Uploading...' : 'Import'}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>

              {status?.message && (
                <div className={status.ok ? styles.success : styles.error}>
                  {status.message}
                </div>
              )}
              {exportStatus?.message && (
                <div className={exportStatus.ok ? styles.success : styles.error}>
                  {exportStatus.message}
                </div>
              )}
            </form>
          )}
        </Formik>

        <section className={styles.fieldsSection}>
          <h2>Required import fields</h2>
          <table className={styles.fieldsTable}>
            <thead>
              <tr>
                <th>CSV column</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {REQUIRED_CSV_COLUMNS.map((col) => (
                <tr key={col}>
                  <td>
                    <code>{col}</code>
                  </td>
                  <td>{CSV_FIELD_INFO[col] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>optionsdesc_sidenote keys</h3>
          <table className={styles.fieldsTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Maps to</th>
              </tr>
            </thead>
            <tbody>
              {SIDENOTE_KEYS.map(({ key, mapsTo }) => (
                <tr key={key}>
                  <td>
                    <code>{key}</code>
                  </td>
                  <td>
                    <code>{mapsTo}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.example}>
            Example:{' '}
            <code>q=1|sku=bn03495|disc=15|vendor=CA905</code>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default AddOption
