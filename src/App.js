import './App.css';
import './reset.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Home from "./component/Home";
import HoHold from "./component/HoHold";
import SpenPatt from "./component/SpenPatt";
import Fixed from "./component/Fixed";
  
function App() {

  // 크기 여부를 확인하는 상태 변수
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // 스마트폰 크기 일 때 이미지 경로를 동적으로 설정
  const logoImage = isMobile ? '/image/mLogo.png' : '/image/wLogo.png';


  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <nav>
            <div className='topMenu'>
              <NavLink to='/'><img src={logoImage} alt="Logo" /></NavLink>

              <ul>
                <li><button type='button'><NavLink to='/HoHold' style={{ textDecoration: "none" }}>가계부</NavLink></button></li>
                <li><button type='button'><NavLink to='/SpenPatt' style={{ textDecoration: "none" }}>소비패턴</NavLink></button></li>
                <li><button type='button'><NavLink to='/Fixed' style={{ textDecoration: "none" }}>고정 지출입</NavLink></button></li>
              </ul>
            </div>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/HoHold/*" element={<HoHold />}/>
            <Route path="/SpenPatt" element={<SpenPatt />}/>
            <Route path="/Fixed" element={<Fixed />}/>
            <Route path="/*" element={<NotFound />}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NotFound(){
  return(
    <div>
      <h2>Sorry!! Page is Not Found!!</h2>
      <p>NotFound...</p>
    </div>
  );
}
export default App;
