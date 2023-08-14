import '../css/Home.css';
import '../reset.css';

import React, { useState } from "react";

function Home({ importData, exportData, onAddData }) {
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
    }).sort((a, b) => b.inputDt.toDate() - a.inputDt.toDate());
  
  // 최근 내역 날짜포맷 수정
  const formatDate = (date) => {
    const optionsDt = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('ko-KR', optionsDt).replace(/ /g, '').replace(/\./g, '-').slice(0, -1);
  };
  
  // 최근 내역에서 보여줄 데이터 8개
  const [visibleDataCount, setVisibleDataCount] = useState(8);
  // 데이터 배열을 필요한 갯수만큼 slice하기
  const visibleData = data.slice(0, visibleDataCount);

  // 더보기 버튼 클릭하면 8개씩 더 가져오기
  const showMore = () => {
    setVisibleDataCount(prevCount => prevCount + 8);
    setIsShowMore(true);
  };

  const hideMore = () => {
    setVisibleDataCount(8);
    setIsShowMore(false);
  };

  const [isShowMore, setIsShowMore] = useState(false);

  // 태그가 있을 때만 #을 붙여서 리턴
  const formatTag = (tag) => {
    if (tag) {
      return "#"+tag
    }
  };

  return (
    <div className='homeApp'>
      <div className='contentDiv'>

        <h3 className='subTitle'>새로운 소비 내역 추가하기</h3>

        <div className='newInput'>
          <table className="">
            <thead>
              <tr>
                <th>지출입</th>
                <th>내역</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>
                    <select value={selectedMoneyValue} onChange={e => setSelectedMoneyValue(e.target.value)}>
                      <option value="수입">수입</option>
                      <option value="지출">지출</option>
                    </select>
                  </td>
                  <td><input type="text" value={inputContentValue} onChange={e => setContentValue(e.target.value)} placeholder="내역을 입력해주세요." /></td>
                  <td><input type="text" value={inputMoneyValue} onChange={e => setMoneyValue(e.target.value)} placeholder="금액을 입력해주세요." /> 원</td>
                </tr>
            </tbody>

            
            <thead>
              <tr>
                <th>날짜</th>
                <th>태그</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td><input type='date' value={inputInputDtValue || ''} onChange={handleDateChange}/></td>
                  <td>#<input type="text" value={inputTagValue} onChange={e => setTagValue(e.target.value)} placeholder="태그를 입력해주세요."/></td>
                </tr>
            </tbody>
          </table>

          <button type='button' onClick={handleAddData}>추가하기</button>
        </div>
      </div>

      <div className='contentDiv'>

        <h3>이번달 자산 현황</h3>
        <h2 className='subTitle'>{ getCurrentMonthBalance().toLocaleString() } 원</h2>

        <div className='assetBorder'>
          <table className="">
            <thead>
              <tr>
                <th>수입</th>
                <th>지출</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>{ getCurrentMonthTotal(true).toLocaleString() } 원</td>
                  <td>{ getCurrentMonthTotal(false).toLocaleString() } 원</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>

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
              {visibleData.map((item, index) => (
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

        <button className='moreBtn' type='button' onClick={isShowMore ? hideMore : showMore}>
          {isShowMore ? '모두 접기' : '더보기'}
        </button>
      </div>
    </div>
  );
}

export default Home;