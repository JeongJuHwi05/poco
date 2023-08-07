import '../css/Home.css';
import '../reset.css';

import React, { useState } from 'react';

function Home() {
  // 새로운 소비 내역 추가 시 지출입 input(combobox)
  const [selectedValue, setSelectedValue] = useState('');
  const [options] = useState(['수입', '지출']);

  const handleInputChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleOptionClick = (option) => {
    setSelectedValue(option);
  };



  return (
    <div className='homeApp'>
      <div className='contentDiv'>
        <h3 className='subTitle'>새로운 소비 내역 추가하기</h3>
        <div className='newInput'>
          <ul>
            <li>지출입</li>
            <li>내역</li>
            <li>금액</li>
          </ul>

          <ul>
            <input type="text" value={selectedValue} onChange={handleInputChange} placeholder="지출입 콤보박스"></input>
            {options.map((option, index) => (
              <li key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </li>
            ))}
            <li><input type="text"value={selectedValue} onChange={handleInputChange} placeholder="내역 입력 inputbox"></input></li>
            <li><input type="text"value={selectedValue} onChange={handleInputChange} placeholder="금액 입력 inputbox"></input></li>
          </ul>

          <ul>
            <li>날짜</li>
            <li>태그</li>
          </ul>

          <ul>
            <li><input type="text"value={selectedValue} onChange={handleInputChange} placeholder="날짜 입력 폼"></input></li>
            <li><input type="text"value={selectedValue} onChange={handleInputChange} placeholder="태그 입력 inputbox"></input></li>
          </ul>
        </div>
      </div>

      <div className='contentDiv'>
        <h3>이번달 자산 현황</h3>
        <h2 className='subTitle'>이번달 전체 금액</h2>

        <div className='assetBorder'>
          <ul>
            <li>수입</li>
            <li>지출</li>
          </ul>

          <ul>
            <li>수입 금액</li>
            <li>지출 금액</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className='subTitle'>최근 내역</h3>
        <div className='lastList'>

        </div>

        <button className='moreBtn' type='button'>더보기</button>
      </div>
    </div>
  );
}

export default Home;