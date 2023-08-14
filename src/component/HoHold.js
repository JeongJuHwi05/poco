import '../reset.css';
import '../css/HoHold.css';

import React, { useState } from "react";

// npm install react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 스타일 import
import { ko } from "date-fns/esm/locale";

function HoHold({ importData, exportData, onDeleteData }) {
  const [filterValue, setFilterValue] = useState('day');
  const [dtValue, setDtValue] = useState(localStorage.getItem('lastSelectedDate') || new Date().toISOString().substr(0, 10));
  const [selectedDtSortValue, setSelectedDtSortValue] = useState('최신순');

 // 달력 데이터 변경 시 
  const handleDateChange = async e => {
    setDtValue(e.target.value);
  };

  // 현재 일, 월, 년의 import 데이터와 export 데이터의 money를 더하는 함수
  const getCurrentTotal = (filterValue) => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      let importTotal = 0;
      let exportTotal = 0;

      switch (filterValue) {
          case 'year':
              importTotal = importData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return valueDate.getFullYear() === currentYear;
                  })
                  .reduce((total, value) => total + value.money, 0);

              exportTotal = exportData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return valueDate.getFullYear() === currentYear;
                  })
                  .reduce((total, value) => total + value.money, 0);
              break;
          case 'month':
              importTotal = importData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return valueDate.getFullYear() === currentYear && valueDate.getMonth() + 1 === currentMonth;
                  })
                  .reduce((total, value) => total + value.money, 0);

              exportTotal = exportData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return valueDate.getFullYear() === currentYear && valueDate.getMonth() + 1 === currentMonth;
                  })
                  .reduce((total, value) => total + value.money, 0);
              break;
          case 'day':
              importTotal = importData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return (
                          valueDate.getFullYear() === currentYear &&
                          valueDate.getMonth() + 1 === currentMonth &&
                          valueDate.getDate() === currentDay
                      );
                  })
                  .reduce((total, value) => total + value.money, 0);

              exportTotal = exportData
                  .filter(value => {
                      const valueDate = new Date(value.inputDt.toDate());
                      return (
                          valueDate.getFullYear() === currentYear &&
                          valueDate.getMonth() + 1 === currentMonth &&
                          valueDate.getDate() === currentDay
                      );
                  })
                  .reduce((total, value) => total + value.money, 0);
              break;
          default:
              break;
    }
    return { importTotal, exportTotal };
  };


  // 현재 월의 수입과 지출 차액을 구하는 함수
  const getCurrentMoneyBalance = (filterValue) => {
    return getCurrentTotal(filterValue).importTotal - getCurrentTotal(filterValue).exportTotal;
  };

  // 최근 내역을 출력하기 위해 importData와 exportData inputDt 순으로 정렬
  const hoHoldDataList = [...importData, ...exportData]
    .filter(item => {
      const valueDate = item.inputDt.toDate();
      const valueYear = valueDate.getFullYear();
      const valueMonth = valueDate.getMonth() + 1;
      const valueDay = valueDate.getDate();

      const selectedYear = parseInt(dtValue.substring(0, 4), 10);
      const selectedMonth = parseInt(dtValue.substring(5, 7), 10);
      const selectedDay = parseInt(dtValue.substring(8, 10), 10);

      return (
        (filterValue === 'day' && valueYear === selectedYear && valueMonth === selectedMonth && valueDay === selectedDay) ||
        (filterValue === 'month' && valueYear === selectedYear && valueMonth === selectedMonth) ||
        (filterValue === 'year' && valueYear === selectedYear)
      );
    })
    .sort((a, b) => {
      const aDate = a.inputDt.toDate();
      const bDate = b.inputDt.toDate();

      if (selectedDtSortValue === '최신순') {
        return bDate - aDate; // 날짜 내림차순으로 정렬
      } else if (selectedDtSortValue === '과거순') {
        return aDate - bDate; // 날짜 오름차순으로 정렬
      }
      
      return 0; // 정렬 순서가 선택되지 않은 경우에는 순서 변경 없음
    });

  
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

  const handleDeleteData = (id, moneyValue) => {
    onDeleteData(id, moneyValue);
  };

  return (
    <div>
      <div className='day'>
        <div>
          <button type='button' onClick={() => setFilterValue('day')}>일일</button>
          <button type='button' onClick={() => setFilterValue('month')}>월별</button>
          <button type='button' onClick={() => setFilterValue('year')}>연간</button>
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
                <td>{getCurrentTotal(filterValue).importTotal.toLocaleString()} 원</td>
                <td>{getCurrentTotal(filterValue).exportTotal.toLocaleString()} 원</td>
                <td>{getCurrentMoneyBalance(filterValue).toLocaleString()} 원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr/>

        <div>
          <div>
            {filterValue === 'day' && (
              <input
                type='date'
                value={dtValue || ''}
                onChange={handleDateChange}
              />
            )}
            {/* Month 형식으로 달력 표시 */}
            {filterValue === 'month' && (
              <DatePicker
                locale={ko}
                selected={new Date(dtValue)}
                onChange={handleDateChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                monthFormat="MM"
              />
            )}

            {/* Year 형식으로 달력 표시 */}
            {filterValue === 'year' && (
              <DatePicker
                selected={new Date(dtValue)}
                onChange={handleDateChange}
                dateFormat="yyyy"
                showYearPicker
              />
            )}
          </div>
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
                {hoHoldDataList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.moneyValue}</td>
                    <td>{item.content}</td>
                    <td>{item.money.toLocaleString()}</td>
                    <td>{formatTag(item.tag)}</td>
                    <td>{formatDate(item.inputDt.toDate())}</td>
                    {item.fixedId ? (
                      <td>고정 지출입 입니다.</td>
                    ) : (
                      <td>
                        <button type='button' onClick={() => handleDeleteData(item.id, item.moneyValue)}>삭제</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoHold;