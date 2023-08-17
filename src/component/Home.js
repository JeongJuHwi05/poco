import '../reset.css';
import stylesHome from '../css/Home.module.css';

import React, { useState, useMemo } from "react";

export default function Home({ importData, exportData, onAddData }) {
  // 달력 데이터 변경 시
  const handleDateChange = e => {
    setInputDtValue(e.target.value);
  };

  const [selectedMoneyValue, setSelectedMoneyValue] = useState('수입');
  const [inputContentValue, setContentValue] = useState('');
  const [inputMoneyValue, setMoneyValue] = useState('');
  const [inputInputDtValue, setInputDtValue] = useState(localStorage.getItem('lastSelectedDate') || new Date().toISOString().substr(0, 10));
  const [inputTagValue, setTagValue] = useState('');

  const handleAddData = () => {
    const newData = {
      moneyValue: selectedMoneyValue,
      content: inputContentValue,
      money: parseFloat(inputMoneyValue),
      inputDt: inputInputDtValue ? new Date(inputInputDtValue) : new Date(),
      insertDt: new Date(),
      tag: inputTagValue
    };

    // 부모 컴포넌트로 데이터 전달
    onAddData(newData);

    // 입력값 초기화
    setSelectedMoneyValue('수입');
    setContentValue('');
    setMoneyValue('');
    setInputDtValue(new Date().toISOString().substr(0, 10));
    setTagValue('');
  };

  // 현재 월의 import 데이터와 export 데이터의 money를 더하는 함수
  const getCurrentMonthTotal = (isImport) => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const data = isImport ? importData : exportData;

      const total = data
          .filter(value => {
              const valueDate = value.inputDt.toDate();
              return valueDate.getFullYear() === currentYear && valueDate.getMonth() + 1 === currentMonth;
          })
          .reduce((acc, value) => acc + value.money, 0);

      return total;
  };

    // 현재 월의 수입과 지출 차액을 구하는 함수
    const getCurrentMonthBalance = () => {
      return getCurrentMonthTotal(true) - getCurrentMonthTotal(false);
    };


  // 최근 내역을 출력하기 위해 importData와 exportData inputDt 순으로 정렬
  const data = [...importData, ...exportData]
    .filter(item => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const valueDate = item.inputDt.toDate();
      const valueYear = valueDate.getFullYear();
      const valueMonth = valueDate.getMonth() + 1;

      return currentYear === valueYear && currentMonth === valueMonth;
    })
    .sort((a, b) => {
      const aDate = a.inputDt.toDate();
      const bDate = b.inputDt.toDate();
      if (aDate.getTime() === bDate.getTime()) {
        // If inputDt is the same, sort based on insertDt
        return b.insertDt.toDate() - a.insertDt.toDate();
      }
      return bDate - aDate; // Sort by inputDt
    });
  
  // 최근 내역에서 보여줄 데이터 8개
  const [visibleDataCount, setVisibleDataCount] = useState(8);

  // 데이터 배열을 필요한 갯수만큼 slice하기
  const visibleData = data.slice(0, visibleDataCount);
  const [isShowMore, setIsShowMore] = useState(false);

  // 높이 값 설정 함수
  const setDivHeight = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1024) {
      return '370px';
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      return '360px';
    } else {
      return '280px';
    }
  };
  
  const [divHeight, setDivHeightState] = useState(setDivHeight()); // 초기 높이값 설정

  // 더보기 버튼 클릭하면 8개씩 더 가져오기
  const showMore = () => {
    window.addEventListener('resize', () => {
      hideMore();
      setDivHeightState(setDivHeight());
    });

    // 8개 이상일 때 기본적인 8개의 데이터 외에 남은 데이터
    const restData = data.length - 8;
    var addRowHeight = 0;

    // 해당하는 media의 펼쳐지는 row값
    switch (divHeight) {
      case "370px":
        addRowHeight = 35;
        break;
      case "360px":
        addRowHeight = 30;
        break;
      case "280px":
        addRowHeight = 25;
        break;
      default:
        addRowHeight = 35;
    }
     
    var newDivHeight = divHeight + restData * addRowHeight;

    setVisibleDataCount(data.length);
    setDivHeight(newDivHeight);
    setIsShowMore(true);
  };

  const hideMore = () => {
    setVisibleDataCount(8);
    setDivHeight(370);
    setIsShowMore(false);
  };
  
  
  // 최근 내역 날짜포맷 수정
  const formatDate = (date) => {
    const optionsDt = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (divHeight === "280px") {
      return new Date(date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('.', '-').slice(0, -1);
    } else {
      return new Date(date).toLocaleDateString('ko-KR', optionsDt).replace(/ /g, '').replace(/\./g, '-').slice(0, -1);
    }
  };

  // 태그가 있을 때만 #을 붙여서 리턴
  const formatTag = (tag) => {
    if (tag) {
      return "#"+tag
    }
  };

  // 현재 활성화된 버튼의 값을 저장하는 상태 변수
  const [activeButton, setActiveButton] = useState(null);

  // 클릭한 버튼에 스타일을 적용하는 함수
  const applyButtonStyle = (buttonValue) => {
    return activeButton === buttonValue ? stylesHome.moneyValueBtnActive : '';
  };

  const handleMoneyValueButtonClick = (value) => {
    setSelectedMoneyValue(value);
    setActiveButton(value);
    applyButtonStyle(value);
  };

  return (
    <div className='app'>
      <div className={stylesHome.contentDiv}>
        <h3 className={stylesHome.subTitle}>새로운 소비 내역 추가하기</h3>
        <div className={stylesHome.newInput}>
          <table className={stylesHome.inputTable}>
            <tbody>
              <tr>
                <th>지출입</th>
                {window.innerWidth <= 767 ? (
                  <td className={stylesHome.moneyValueBtnDiv}>
                    <button className={`${stylesHome.moneyValueBtn} ${activeButton === '수입' ? stylesHome.moneyValueBtnActive : ''}`} onClick={() => handleMoneyValueButtonClick('수입')}>수입</button>
                    <button className={`${stylesHome.moneyValueBtn} ${activeButton === '지출' ? stylesHome.moneyValueBtnActive : ''}`} onClick={() => handleMoneyValueButtonClick('지출')}>지출</button>
                  </td>
                ) : (
                  <td>
                    <select className={stylesHome.tableSelect} value={selectedMoneyValue} onChange={(e) => setSelectedMoneyValue(e.target.value)}>
                      <option value="수입">수입</option>
                      <option value="지출">지출</option>
                    </select>
                  </td>
                )}

                <th>내역</th>
                <td>
                  <input className={stylesHome.tableInput} type="text" value={inputContentValue} onChange={(e) => setContentValue(e.target.value)} placeholder="내역을 입력해주세요." />
                </td>

                <th>금액</th>
                <td>
                  <input className={stylesHome.tableInput} type="number" value={inputMoneyValue} onChange={(e) => setMoneyValue(e.target.value)} placeholder="금액을 입력해주세요." />{" "} 원
                </td>

                <th>날짜</th>
                <td>
                  <input className={stylesHome.tableInput} type="date" value={inputInputDtValue || ""} onChange={handleDateChange} />
                </td>

                <th>태그</th>
                <td>
                  #<input className={stylesHome.tableInput} type="text" value={inputTagValue} onChange={(e) => setTagValue(e.target.value)} placeholder="태그를 입력해주세요." />
                </td>
              </tr>
            </tbody>
          </table>

          <button className={stylesHome.addBtn} type='button' onClick={handleAddData}>추가하기</button>
        </div>
      </div>

      <div className={stylesHome.contentDiv}>
        <h3>이번 달 자산 현황</h3>
        <h2>{ getCurrentMonthBalance().toLocaleString() } 원</h2>

        <div className={`${stylesHome.tableDiv} ${stylesHome.conditionDiv}`}>
          <table className={stylesHome.conditionTable}>
            <thead>
              <tr>
                <th>수입</th>
                <th>지출</th>
                <th>전체</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{ getCurrentMonthTotal(true).toLocaleString() } 원</td>
                  <td>{ getCurrentMonthTotal(false).toLocaleString() } 원</td>
                  <td>{ (getCurrentMonthTotal(true)-getCurrentMonthTotal(false)).toLocaleString() } 원</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className={stylesHome.subTitle}>이번 달 최근 내역</h3>
        <div className={`${stylesHome.tableDiv} ${stylesHome.lastListDiv}`} style={{ height: `${divHeight}px` }}>
          <table className={stylesHome.lastListTable}>
            <thead>
              <tr>
                <th>지출입</th>
                <th>내역</th>
                <th>금액</th>
                <th>태그</th>
                <th>날짜</th>
              </tr>
            </thead>

            <tbody>
              {visibleData.map((item, index) => (
                <tr key={index}>
                  <td>{item.moneyValue}</td>
                  <td className={stylesHome.dataAlignLeft}>{item.content}</td>
                  <td>{item.money.toLocaleString()}</td>
                  <td className={stylesHome.alignLeft}>{formatTag(item.tag)}</td>
                  <td>{formatDate(item.inputDt.toDate())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleData.length >= 8 && (
          <button className={stylesHome.moreBtn} type='button' onClick={isShowMore ? hideMore : showMore}>
            {isShowMore ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </div>
  );
}