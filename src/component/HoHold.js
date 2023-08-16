import '../reset.css';
import '../css/HoHold.css';

import React, { useState } from "react";

// npm install react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // 스타일 import
import { ko } from "date-fns/esm/locale";

function HoHold({ importData, exportData, onDeleteData }) {
  const [filterValue, setFilterValue] = useState('day');
  const [selectedDtSortValue, setSelectedDtSortValue] = useState('최신순');
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const [dtValue, setDtValue] = useState(() => {
    if (filterValue === 'year') {
      return currentYear.toString();
    } else if (filterValue === 'month') {
      return `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;
    } else {
      return localStorage.getItem('lastSelectedDate') || new Date().toISOString().substr(0, 10);
    }
  });

  const handleDateChange = (e) => {
    if (filterValue === 'year') {
      setDtValue(e.getFullYear().toString());
    } else if (filterValue === 'month') {
      var getMonth = e.getMonth() + 1;
      setDtValue(`${e.getFullYear()}-${getMonth < 10 ? '0' : ''}${getMonth}`);
    } else {
      setDtValue(e.target.value);
    }
  };

  const handleMonthChange = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    setDtValue(`${year}-${month < 10 ? '0' : ''}${month}`);
  };
  
  // 현재 일, 월, 년의 import 데이터와 export 데이터의 money를 더하는 함수
  const getCurrentTotal = (filterValue) => {
    const selectedDate = new Date(dtValue);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedDay = selectedDate.getDate();

    let importTotal = 0;
    let exportTotal = 0;

    switch (filterValue) {
      case 'year':
        importTotal = importData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return valueDate.getFullYear() === selectedYear;
          })
          .reduce((total, value) => total + value.money, 0);

        exportTotal = exportData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return valueDate.getFullYear() === selectedYear;
          })
          .reduce((total, value) => total + value.money, 0);
        break;
      case 'month':
        importTotal = importData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return valueDate.getFullYear() === selectedYear && valueDate.getMonth() + 1 === selectedMonth;
          })
          .reduce((total, value) => total + value.money, 0);

        exportTotal = exportData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return valueDate.getFullYear() === selectedYear && valueDate.getMonth() + 1 === selectedMonth;
          })
          .reduce((total, value) => total + value.money, 0);
        break;
      case 'day':
        importTotal = importData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return (
              valueDate.getFullYear() === selectedYear &&
              valueDate.getMonth() + 1 === selectedMonth &&
              valueDate.getDate() === selectedDay
            );
          })
          .reduce((total, value) => total + value.money, 0);

        exportTotal = exportData
          .filter(value => {
            const valueDate = new Date(value.inputDt.toDate());
            return (
              valueDate.getFullYear() === selectedYear &&
              valueDate.getMonth() + 1 === selectedMonth &&
              valueDate.getDate() === selectedDay
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
    })
    .sort((b, a) => {
      const aInsertDate = a.insertDt.toDate();
      const bInsertDate = b.insertDt.toDate();
      return aInsertDate - bInsertDate; // insertDt 순으로 정렬
    });
  
  // year일 때 데이터 담을 객체
  const groupedMonthData = {};

  // year일 때 데이터 월별로 가공
  hoHoldDataList.forEach(item => {
    const date = new Date(item.inputDt.toDate());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month < 10 ? '0' : ''}${month}`;

    if (!groupedMonthData[key]) {
      groupedMonthData[key] = [];
    }

    groupedMonthData[key].push(item);
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

  // 데이터 삭제
  const handleDeleteData = (id, moneyValue) => {
    onDeleteData(id, moneyValue);
  };

  return (
    <div>
      <div>
        <div>
          <button type='button' onClick={() => { setFilterValue('day'); setDtValue(new Date().toISOString().substr(0, 10)); }}>일일</button>
          <button type='button' onClick={() => { setFilterValue('month'); setDtValue(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) < 10 ? '0' : ''}${new Date().getMonth() + 1}`); }}>월별</button>
          <button type='button' onClick={() => { setFilterValue('year'); setDtValue(new Date().getFullYear().toString()); }}>연간</button>
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
            {/* day 형식으로 달력 표시 */}
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
                onChange={handleMonthChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                monthFormat="MM"
                yearDropdownItemNumber={10}
                yearDropdownScrollable
                scrollableYearDropdown
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

          <button type='button' onClick={() => {
            if (filterValue === 'day') {
              setDtValue(new Date().toISOString().substr(0, 10));
            } else if (filterValue === 'month') {
              const now = new Date();
              setDtValue(`${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' : ''}${now.getMonth() + 1}`);
            } else if (filterValue === 'year') {
              setDtValue(new Date().getFullYear().toString());
            }
            setFilterValue(filterValue);
          }}>
            현재
          </button>
        </div>

        <hr />
        
        <div>
          <div>
            <p className='subTitle'>최근 내역</p>

            <select value={selectedDtSortValue} onChange={e => setSelectedDtSortValue(e.target.value)}>
              <option value="최신순">최신순</option>
              <option value="과거순">과거순</option>
            </select>
          </div>

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

              {filterValue === 'year' ? (
                  <>
                    {Object.entries(groupedMonthData).map(([key, data], index) => (
                      <tbody key={index}>
                        <tr className="monthHeader">
                          <td colSpan="5">{`${key.split('-')[1]}월`}</td>
                        </tr>
                        {data.map((item, index) => (
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
                    ))}
                  </>
                ) : (
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
                )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoHold;