import '../reset.css';
import '../css/HoHold.css';

import React, { useState } from 'react';

function HoHold({ importData, exportData, onAddData, onDeleteData }) {
  
  const [filterValue, setFilterValue] = useState('일일');
  const [dtValue, setDtValue] = useState(localStorage.getItem('lastSelectedDate') || new Date().toISOString().substr(0, 10));
  const [selectedDtSortValue, setSelectedDtSortValue] = useState('최신순');

  const handleDateChange = e => {
    setDtValue(e.target.value);
  };

  // 현재 월의 import 데이터의 money를 더하는 함수
  const getCurrentMonthImportTotal = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const importTotal = importData
      .filter(value => {
        const valueDate = value.inputDt.toDate();
        return valueDate.getFullYear() === currentYear && valueDate.getMonth() + 1 === currentMonth;
      })
      .reduce((total, value) => total + value.money, 0);

    return importTotal;
  };

  // 현재 월의 export 데이터의 money를 더하는 함수
  const getCurrentMonthExportTotal = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const exportTotal = exportData
      .filter(value => {
        const valueDate = value.inputDt.toDate();
        return valueDate.getFullYear() === currentYear && valueDate.getMonth() + 1 === currentMonth;
      })
      .reduce((total, value) => total + value.money, 0);

    return exportTotal;
  };

  // 현재 월의 수입과 지출 차액을 구하는 함수
  const getCurrentMonthBalance = () => {
    return getCurrentMonthImportTotal() - getCurrentMonthExportTotal();
  };

  // 최근 내역을 출력하기 위해 importData와 exportData inputDt 순으로 정렬
  const dayData = [...importData, ...exportData]
    .filter(item => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDay();

      const valueDate = item.inputDt.toDate();
      const valueYear = valueDate.getFullYear();
      const valueMonth = valueDate.getMonth() + 1;

      return currentYear === valueYear && currentMonth === valueMonth && currentDay === dtValue;
    })
    .sort((a, b) => {
      const aDate = a.inputDt.toDate();
      const bDate = b.inputDt.toDate();
      return aDate - bDate; // 날짜 오름차순으로 정렬
    });

  // 최근 내역을 출력하기 위해 importData와 exportData inputDt 순으로 정렬
  const monthData = [...importData, ...exportData]
    .filter(item => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const valueDate = item.inputDt.toDate();
      const valueYear = valueDate.getFullYear();
      const valueMonth = valueDate.getMonth() + 1;

      return currentYear === valueYear && currentMonth === valueMonth;
    }).sort((a, b) => b.inputDt.toDate() - a.inputDt.toDate());
  
  // 최근 내역 날짜포맷 수정
  const formatDate = (date) => {
    const optionsDt = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('ko-KR', optionsDt).replace(/ /g, '').replace(/\./g, '-').slice(0, -1);
  };

  // 태그가 있을 때만 #을 붙여서 리턴
  const formatTag = (tag) => {
    if (tag) {
      return "#"+tag
    }
  };

  return (
    <div>
      <div className='day'>
        <div>
          <button type='button' onClick={() => setFilterValue('일일')}>일일</button>
          <button type='button' onClick={() => setFilterValue('월별')}>월별</button>
          <button type='button' onClick={() => setFilterValue('연간')}>연간</button>
        </div>

        <hr />
        
        <div>
          <table>
            <thead>
              <tr>
                <th>수입</th>
                <th>지출</th>
                <th>전체</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{ getCurrentMonthImportTotal().toLocaleString() } 원</td>
                  <td>{ getCurrentMonthExportTotal().toLocaleString() } 원</td>
                  <td>{ getCurrentMonthBalance().toLocaleString() } 원</td>
                </tr>
            </tbody>
          </table>
        </div>

        <hr/>

        <div>
          <input type='date' value={dtValue || ''} onChange={handleDateChange} />
          <select value={selectedDtSortValue} onChange={e => setSelectedDtSortValue(e.target.value)}>
            <option value="최신순">최신순</option>
            <option value="과거순">과거순</option>
          </select>
        </div>

        <hr />
        
        <div>
          <h3 className='subTitle'>최근 내역</h3>
          <div className='lastList'>
            <table className="">
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
                {dayData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.moneyValue}</td>
                    <td>{item.content}</td>
                    <td>{item.money.toLocaleString()}</td>
                    <td>{formatTag(item.tag)}</td>
                    <td>{formatDate(item.inputDt.toDate())}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='month'>

      </div>

      <div className='year'>

      </div>
    </div>
  );
}

export default HoHold;