import './App.css';
import './reset.css';

import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useEffect,useState } from 'react';

import { db } from './firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from '@firebase/firestore';

import Home from "./component/Home";
import HoHold from "./component/HoHold";
import SpenPatt from "./component/SpenPatt";
import Fixed from "./component/Fixed";
  
function App() {
  // 렌더링 상태를 체크하기 위한 state 추가
  const [changed, setChanged] = useState(false)

  // 데이터를 저장할 state 생성
  const [importData, setImportData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [fixedData, setFixedData] = useState([]);

  // 데이터베이스 연결 객체 생성
  const importCollectionRef = collection(db, 'importCoin');
  const exportCollectionRef = collection(db, 'exportCoin');
  const fixedCollectionRef = collection(db, 'fixedCoin');

  useEffect(() => {
    const getList = async () => {
      // import 컬렉션 데이터 가져오기
      const importData = await getDocs(importCollectionRef);
      setImportData(
        importData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      // export 컬렉션 데이터 가져오기
      const exportData = await getDocs(exportCollectionRef);
      setExportData(
        exportData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      // export 컬렉션 데이터 가져오기
      const fixedData = await getDocs(fixedCollectionRef);
      setFixedData(
        fixedData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    getList();
    setChanged(false)
  }, [changed]);

  // 크기 여부를 확인하는 상태 변수
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // 스마트폰 크기 일 때 로고 이미지 경로를 동적으로 설정
  const logoImage = isMobile ? '/image/logo/mLogo.png' : '/image/logo/wLogo.png';

  // 사이드 메뉴 초기값 false로 설정
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [menuIcon, setMenuIcon] = useState('/image/icon/menuIcon.png'); // 초기 아이콘 경로

  // 사이드 메뉴 이벤트 함수
  const toggleSideMenu = () => {
    setSideMenuOpen(!isSideMenuOpen);

    // 메뉴 열기/닫기에 따라 아이콘 경로 변경
    if (isSideMenuOpen) {
      setMenuIcon('/image/icon/menuIcon.png');
    } else {
      setMenuIcon('/image/icon/xIcon.png');
    }
  };

  const handleMouseOver = () => {
    // 마우스 오버 시 아이콘 경로 변경
    if (!isSideMenuOpen) {
      setMenuIcon('/image/icon/menuIcon_hover.png');
    } else {
      setMenuIcon('/image/icon/xIcon_hover.png');
    }
  };

  const handleMouseOut = () => {
    // 마우스가 벗어났을 때 아이콘 경로 초기화
    if (!isSideMenuOpen) {
      setMenuIcon('/image/icon/menuIcon.png');
    } else {
      setMenuIcon('/image/icon/xIcon.png');
    }
  };

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

  // 데이터 추가 함수
  const handleAddData = async (newData) => {
      try {
        const collectionName = newData.moneyValue === '수입' ? 'importCoin' : 'exportCoin';
        await addDoc(collection(db, collectionName), newData);
        setChanged(true)
        console.log('Data added successfully');
      } catch (error) {
        console.error('Error adding document:', error);
      }
  };

  // fixed데이터 추가 함수
  const handleAddFixedData = async (fixedCoinData) => {
      try {
        await addDoc(collection(db, 'fixedCoin'), fixedCoinData);
        setChanged(true)
        console.log('Fixed Data added successfully');
      } catch (error) {
        console.error('Error adding document:', error);
      }
  };

  // 데이터 삭제
  const handleDeleteData = async (id, moneyValue, fixedId) => {
    if (!fixedId) {
      try {
        // importCoin 또는 exportCoin에서 Id와 일치하는 데이터 삭제
        const collectionName = moneyValue === '수입' ? 'importCoin' : 'exportCoin';
        await deleteDoc(doc(db, collectionName, id));

        console.log('Related data deleted successfully(일반)');
        setChanged(true)
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }else {
      try {
        // fixedCoin에서 데이터 삭제
        await deleteDoc(doc(db, 'fixedCoin', id));
        console.log('FixedData deleted successfully');

        // importCoin 또는 exportCoin에서 해당 fixedId와 일치하는 데이터 삭제
        const collectionToCheck = moneyValue === '수입' ? 'importCoin' : 'exportCoin';
        const querySnapshot = await getDocs(query(collection(db, collectionToCheck), where('fixedId', '==', fixedId)));
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        console.log('Related data deleted successfully');
        setChanged(true);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
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
                      <img className="menuIcon" src={menuIcon} alt="Menu" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
                    </button>
                    <div className={`sideMenu ${isSideMenuOpen ? 'active' : ''}`}>
                      <ul>
                        <li><NavLink to='/HoHold' className='navLinkMButton' activeClassName='activeMBtn' onClick={() => {setActiveButton('HoHold'); toggleSideMenu();}}>가계부</NavLink></li>
                        <li><NavLink to='/SpenPatt' className='navLinkMButton' activeClassName='activeMBtn' onClick={() => {setActiveButton('SpenPatt'); toggleSideMenu();}}>소비패턴</NavLink></li>
                        <li><NavLink to='/Fixed' className='navLinkMButton' activeClassName='activeMBtn' onClick={() => {setActiveButton('Fixed'); toggleSideMenu();}}>고정 지출입</NavLink></li>
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
            <Route path="/" element={<Home importData={importData} exportData={exportData} onAddData={handleAddData} />} />
            <Route path="/HoHold/*" element={<HoHold importData={importData} exportData={exportData} onDeleteData={handleDeleteData}/>}/>
            <Route path="/SpenPatt" element={<SpenPatt exportData={exportData} />}/>
            <Route path="/Fixed" element={<Fixed fixedData={fixedData} onAddData={handleAddData} onFixedAddData={handleAddFixedData} onDeleteData={handleDeleteData}/>}/>
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