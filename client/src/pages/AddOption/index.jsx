import classNames from 'classnames'
import Button from 'react-bootstrap/Button'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from './AddOption.module.scss'
import { IMPORT_OPTION_SCHEMA } from '../../utils/orderValidationSchema'
import { saveOption, getOptions, saveOptionsFile } from '../../api'
import { OPTION_DATA } from "../../utils/optionsData"
import { parseCsvFile, mergeOptionsFromCsv } from '../../utils/mergeOptionsFromCsv'



function AddOption() {
  const initialValues = {
    file: null,
  }


  const handleSubmit = async (values) => {
    if (!values.file) return

    const rows = await parseCsvFile(values.file);
    const merged = mergeOptionsFromCsv(OPTION_DATA, rows);
    await saveOptionsFile(merged);

    //console.log("Has 7886?", merged.some((x) => Number(x.id) === 7886));
    //console.log("7886 row:", merged.find((x) => Number(x.id) === 7886));

  }

  return (
    <div>
      <Header />
      <div className={styles.optionWrapper}>
        <h1>Import Options</h1>
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

              <button type="submit" disabled={isSubmitting || !values.file}>
                {isSubmitting ? 'Uploading...' : 'Import'}
              </button>

              {status?.message && (
                <div className={status.ok ? styles.success : styles.error}>
                  {status.message}
                </div>
              )}
            </form>
          )}
        </Formik>
      </div>
      <Footer />
    </div>
  )
}

export default AddOption
