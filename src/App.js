import { useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import BaseTabs from './components/BaseTabs/BaseTabs';
import logo from './logo_book_left.png'
import logoRight from './KTB_Logo_rigth.png'
import logoWriteRight from './KTB_Logo_white_right.png'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };
  return (
    <div className={`min-vh-100 bg-${isDarkMode ? 'dark' : ''}`} >
      <div className='container position-relative'>
        <header>
          <div className='pb-2 pt-3 d-flex align-items-center justify-content-between' >
            <div className='d-flex align-items-center' >
              <img className={isDarkMode ? 'invert' : ''} width={35} height={35} src={logo} alt='logo' />
              <h1 className={`ms-2 mb-0 fs-3 text-${isDarkMode ? 'white' : 'dark'}`} >||KTBU Schichtbuch||</h1>
            </div>
            <div className='d-flex justify-content-evenly align-items-center' >
              <img width={100} height={35} src={isDarkMode ? logoWriteRight : logoRight} alt='logo' />
              <span className={`position_absolute d-flex align-items-center rounded p-1 mr-4 bg-${isDarkMode ? 'white' : 'dark'}`} >
                <DarkModeSwitch
                  style={{ marginBottom: '0rem' }}
                  moonColor='black'
                  sunColor='white'
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size={20}
                />
              </span>
            </div>
          </div>
        </header>
        <BaseTabs darkMode={isDarkMode} />

      </div>
    </div>
  );
}

export default App;
