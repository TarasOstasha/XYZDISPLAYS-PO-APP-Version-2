import { FilePdf } from 'react-bootstrap-icons'
import React from 'react'
import styles from './Footer.module.scss'
import { Link } from 'react-router-dom'

const vendorCatalog = [
  {
    vendor: 'WS Display',
    link:
      'https://drive.google.com/file/d/1ZZqpYvq7FDAzq5eZ0VpCD9I2moNnuA05/view?usp=drive_link',
  },
  {
    vendor: 'Vue More',
    link:
      'https://docs.google.com/spreadsheets/d/1SIVnEIfaiXHsaPb_beFx9VSPxKmgduHd/edit?usp=sharing&ouid=105022464589270043327&rtpof=true&sd=true',
  },
  {
    vendor: 'United Visual',
    link:
      'https://drive.google.com/file/d/1-C3yAU5E0FK4EewuGuN0bOMASGqSgWk4/view?usp=drive_link',
  },
  {
    vendor: 'TV Liquidator',
    link:
      'https://drive.google.com/file/d/1wBZ3SN_20Cc90W1SXC1uLy2cpmg-Hx-e/view?usp=sharing',
  },
  {
    vendor: 'Smart Media',
    link:
      'https://drive.google.com/file/d/1JUfbMVXc_e1e10x-cGx540w4sXq3wv_l/view?usp=sharing',
  },
  {
    vendor: 'Showdown',
    link:
      'https://drive.google.com/file/d/1ZwI0EepQgPSjGvpy4SJvHm7H4-57tf3X/view?usp=drive_link',
  },
  {
    vendor: 'PE',
    link:
      'https://docs.google.com/spreadsheets/d/19fDvfqo5i5uYZj6xJaBXz-_UOuKBEVAI/edit?usp=sharing&ouid=105022464589270043327&rtpof=true&sd=true',
  },
  {
    vendor: 'Orbus',
    link:
      'https://docs.google.com/spreadsheets/d/1UrRzQIOIwLj5jOpbnDt3CGLfr-LI7No0/edit?usp=sharing&ouid=105022464589270043327&rtpof=true&sd=true',
  },
  {
    vendor: 'Novodek',
    link:
      'https://docs.google.com/spreadsheets/d/1VinoxOYlZUeaw46s12Vc2tuL-wPEritv/edit?usp=sharing&ouid=105022464589270043327&rtpof=true&sd=true',
  },
  {
    vendor: 'North America',
    link:
      'https://drive.google.com/file/d/1-DicdhQDrwDUJlfHhj9VHLuYCiKwZ439/view?usp=drive_link',
  },
  {
    vendor: 'Makitso',
    link:
      'https://drive.google.com/file/d/1tjWAEpupmLoPOlf9cdnB2Hlkny_gkq9P/view?usp=sharing',
  },
  {
    vendor: 'LED Scopic',
    link:
      'https://drive.google.com/file/d/12-kEIEsuFVwLHVChV8Y7A0zLrxuvTSqA/view?usp=sharing',
  },
  {
    vendor: 'KS Intl',
    link:
      'https://drive.google.com/file/d/1Q9HM1MMj4rD83QkCmJBxPIxMW1SGfAlH/view?usp=sharing',
  },
  {
    vendor: 'Gold Metal TLT',
    link:
      'https://drive.google.com/file/d/1apz3CaYr43tBPFqXvOy2ABNWkSwHxznP/view?usp=sharing',
  },
  {
    vendor: 'Dynapac',
    link:
      'https://docs.google.com/spreadsheets/d/1D3JbbJqdgDAbmxOs-yZJqtW0ygfdmSKV/edit?usp=drive_link&ouid=105022464589270043327&rtpof=true&sd=true',
  },
  {
    vendor: 'Case Design',
    link:
      'https://drive.google.com/file/d/1dINN2wsOLO3kgj-0JF6HntAIcMMPvhvp/view?usp=sharing',
  },
  {
    vendor: 'BrandStand',
    link:
      'https://drive.google.com/file/d/1ME3UPUgnkP3wJFWAWClTUDFd0LxFuDbF/view?usp=sharing',
  },
  {
    vendor: 'Bowman Displays',
    link:
      'https://drive.google.com/file/d/1NbnD2NLEKDfwv8kLQG_SBE49rB5WlP8e/view?usp=drive_link',
  },
]

function Footer() {
  return (
    <div className={styles.linkWrapper}>
      <ul className={`${styles.linkList} `}>
        {vendorCatalog.map((catalog, index) => (
          <li key={index} className={`${styles.vendorLink} `}>
            <FilePdf className={styles.pdf} />
            <a target="_blank" href={catalog.link}>
              {catalog.vendor}
            </a>
          </li>
        ))}
      </ul>
      <ul className={`${styles.linkList} `}>
        {/* Add a link to the /updateFolder page */}
        <li className={styles.vendorLink}>
          <Link to="/updateFolder" className={styles.updateFolderLink}>
            {/* Update Build Folder */}
            Update APP
          </Link>
        </li>
        {/* <li className={styles.vendorLink}>
          <Link
            to="/updateServer"
            className={styles.updateFolderLink}
            onClick={(e) => {
              const confirmed = window.confirm("Are you sure you want to update the backend?");
              if (!confirmed) {
                e.preventDefault(); 
              }
            }}
          >
            Update BackEnd
          </Link>
        </li> */}
      </ul>
    </div>
  )
}

export default Footer
