import { FilePdf  } from 'react-bootstrap-icons';
import React from 'react';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';

const vendorCatalog = [
  {
    vendor: 'WS Display',
    link: 'https://drive.google.com/file/d/1ZZqpYvq7FDAzq5eZ0VpCD9I2moNnuA05/view?usp=drive_link'
  },
  {
    vendor: 'Vue More',
    link: 'https://docs.google.com/spreadsheets/d/1SIVnEIfaiXHsaPb_beFx9VSPxKmgduHd/edit?usp=drive_link'
  },
  {
    vendor: 'United Visual',
    link: 'https://drive.google.com/file/d/1-C3yAU5E0FK4EewuGuN0bOMASGqSgWk4/view?usp=drive_link'
  },
  {
    vendor: 'TV Liquidator',
    link: 'https://drive.google.com/file/d/10IIxMkNAWSU9GGgcPCsllzPu-haQgajh/view?usp=drive_link'
  },
  {
    vendor: 'Smart Media',
    link: 'https://drive.google.com/file/d/1-0wcA6A8KhQHWlB6_npTEEawXUaoJq7M/view?usp=drive_link'
  },
  {
    vendor: 'Showdown',
    link: 'https://drive.google.com/file/d/1ZwI0EepQgPSjGvpy4SJvHm7H4-57tf3X/view?usp=drive_link'
  },
  {
    vendor: 'PE',
    link: 'https://drive.google.com/file/d/1ROi84TsTygF-aKYXgGOcBFZIukwvY7oj/view?usp=drive_link'
  },
  {
    vendor: 'Orbus',
    link: 'https://drive.google.com/file/d/1QdDTpWsMHAE2Be2FKhJqWbHk6ryROEe5/view?usp=drive_link'
  },
  {
    vendor: 'Novodek',
    link: 'https://docs.google.com/spreadsheets/d/1NwDWu6pWz8Fo3qFHj9f4n-5ZYqjqJRpr/edit?usp=drive_link&ouid=105022464589270043327&rtpof=true&sd=true'
  },
  {
    vendor: 'North America',
    link: 'https://drive.google.com/file/d/1-DicdhQDrwDUJlfHhj9VHLuYCiKwZ439/view?usp=drive_link'
  },
  {
    vendor: 'Makitso',
    link: 'https://drive.google.com/file/d/1hhmvKlViTmzJ8BCGxYb1vAem9YVVGsQr/view?usp=drive_link'
  },
  {
    vendor: 'LED Scopic',
    link: 'https://drive.google.com/file/d/12-kEIEsuFVwLHVChV8Y7A0zLrxuvTSqA/view?usp=drive_link'
  },
  {
    vendor: 'KS Intl',
    link: 'https://drive.google.com/file/d/1krQVmvPS8Pq3UAvymz8eK5BMHlEH68St/view?usp=drive_link'
  },
  {
    vendor: 'Gold Metal TLT',
    link: 'https://drive.google.com/file/d/1apz3CaYr43tBPFqXvOy2ABNWkSwHxznP/view?usp=drive_link'
  },
  {
    vendor: 'Dynapac',
    link: 'https://docs.google.com/spreadsheets/d/1SUOGbH5W_8M5fIc1WGumMBdKPTi9OtVi/edit?usp=drive_link'
  },
  {
    vendor: 'Case Design',
    link: 'https://drive.google.com/file/d/1HKQ1wSqfN3MM16wo18P_HZCMhCeaW1uN/view?usp=drive_link'
  },
  {
    vendor: 'BrandStand',
    link: 'https://drive.google.com/file/d/1-t0DaMuIlypD_FO6RbLrlf503Fsuk9Ax/view?usp=drive_link'
  },
  {
    vendor: 'Bowman Displays',
    link: 'https://drive.google.com/file/d/1NbnD2NLEKDfwv8kLQG_SBE49rB5WlP8e/view?usp=drive_link'
  }
]

function Footer() {
  return (
    <div className={styles.linkWrapper}>
      
      <ul className={`${styles.linkList} `}>
        {
          vendorCatalog.map((catalog, index) => (
            <li key={index} className={`${styles.vendorLink} `}>
              <FilePdf className={styles.pdf}  />
              <a target="_blank" href={catalog.link}>{catalog.vendor}</a>
            </li>
          ))
        }
      </ul>
      <ul className={`${styles.linkList} `}>
        {/* Add a link to the /updateFolder page */}
                <li className={styles.vendorLink}>
          <Link to="/updateFolder" className={styles.updateFolderLink}>
            Update Build Folder
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Footer