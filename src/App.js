import './App.css';
import './reset.css';

import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useEffect,useState } from 'react';

import { db } from './firebase';
import { collection, getDocs, doc } from '@firebase/firestore';

import Home from "./component/Home";
import HoHold from "./component/HoHold";
import SpenPatt from "./component/SpenPatt";
import Fixed from "./component/Fixed";
  
function App() {
  // 데이터베이스 연결 객체 생성
  const pocoCollectionRef = collection(db, 'poco')
  console.log(pocoCollectionRef);

  useEffect( () => {
    // async 사용해서 비동기 식으로 사용
    const getList = async () => {
      // getDocs(DB 연결객체)로 데이터 가져오기
      // query(DB 연결객체, orderBy("기준열","정렬 방식"))

      const data = await getDocs(
        pocoCollectionRef
      )
    }

    getList();
  },[])


  // 크기 여부를 확인하는 상태 변수
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // 스마트폰 크기 일 때 이미지 경로를 동적으로 설정
  const logoImage = isMobile ? '/image/logo/mLogo.png' : '/image/logo/wLogo.png';

  // 사이드 메뉴 초기값 false로 설정
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  // 사이드 메뉴 이벤트 함수
  const toggleSideMenu = () => {
    setSideMenuOpen(!isSideMenuOpen);
  };
  
  // 스마트폰 크기 일 때 메뉴 아이콘 경로를 동적으로 설정
  const menuIcon = isSideMenuOpen ? '/image/icon/xIcon.png' : '/image/icon/menuIcon.png';

  // 현재 활성화된 버튼의 값을 저장하는 상태 변수
  const [activeButton, setActiveButton] = useState(null);

  // 클릭한 버튼에 스타일을 적용하는 함수
  const applyButtonStyle = (buttonValue) => {
    if (buttonValue === '/') {
      return buttonValue = '';
    } else if (buttonValue.substr(0, 1) === 'm') {
      return activeButton === buttonValue.substr(1) ? 'activeMBtn' : '';
    } else {
      return activeButton === buttonValue ? 'activeBtn' : '';
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <nav>
            <div className='topMenu'>
              <NavLink to='/' className={`navLinkButton ${applyButtonStyle('/')}`} onClick={() => setActiveButton('/')}>
                  <img className='mainLogo' src={logoImage} alt="Logo" />
              </NavLink>

              {isMobile ?
                (
                  <div>
                    <button className={`sideMenuToggle ${isSideMenuOpen ? 'active' : ''}`} onClick={toggleSideMenu}>
                      <img src={menuIcon} alt='Menu'/>
                    </button>
                    <div className={`sideMenu ${isSideMenuOpen ? 'active' : ''}`}>
                      <ul>
                        <li><NavLink to='/HoHold' className={`navLinkMButton ${applyButtonStyle('mHoHold')}`} onClick={() => setActiveButton('HoHold')}>가계부</NavLink></li>
                        <li><NavLink to='/SpenPatt' className={`navLinkMButton ${applyButtonStyle('mSpenPatt')}`} onClick={() => setActiveButton('SpenPatt')}>소비패턴</NavLink></li>
                        <li><NavLink to='/Fixed' className={`navLinkMButton ${applyButtonStyle('mFixed')}`} onClick={() => setActiveButton('Fixed')}>고정 지출입</NavLink></li>
                      </ul>
                    </div>
                  </div>
                )
                :
                (
                  <ul>
                    <li>
                      <NavLink to='/HoHold'>
                        <button className={`navLinkButton ${applyButtonStyle('HoHold')}`} type='button' onClick={() => setActiveButton('HoHold')}>
                          가계부
                        </button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/SpenPatt'>
                        <button className={`navLinkButton ${applyButtonStyle('SpenPatt')}`} type='button' onClick={() => setActiveButton('SpenPatt')}>
                          소비패턴
                        </button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/Fixed'>
                        <button className={`navLinkButton ${applyButtonStyle('Fixed')}`} type='button' onClick={() => setActiveButton('Fixed')}>
                          고정 지출입
                        </button>
                      </NavLink>
                    </li>
                  </ul>
                )
              }
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
