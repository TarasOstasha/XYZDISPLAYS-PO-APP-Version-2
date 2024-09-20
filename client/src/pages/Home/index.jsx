import  Header from '../../components/Header';
import  Footer from '../../components/Footer';
import OrderFreight from '../../components/OrderFreight';

function Home() {
  return (
    <div className='container'>
        <Header />    
            {/* Home Page */}
            <OrderFreight />
        <Footer />
    </div>
  )
}

export default Home