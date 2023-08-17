import '../reset.css';
import stylesFixed from '../css/Fixed.module.css';

import React, { useState } from 'react';

function Fixed({ fixedData, onAddData, onFixedAddData, onDeleteData }) {

    const [selectedMoneyValue, setSelectedMoneyValue] = useState('수입');
    const [inputContentValue, setContentValue] = useState('');
    const [inputFixedDt, setFixedValue] = useState('01');
    const [inputMoneyValue, setMoneyValue] = useState('');
    const [inputTagValue, setTagValue] = useState('');
    const [filterValue, setFilterValue] = useState('전체');

    // 현재 활성화된 버튼의 값을 저장하는 상태 변수
    const [activeButton, setActiveButton] = useState(null);

    // 클릭한 버튼에 스타일을 적용하는 함수
    const applyButtonStyle = (buttonValue) => {
        return activeButton === buttonValue ? stylesFixed.moneyValueBtnActive : '';
    };

    const handleMoneyValueButtonClick = (value) => {
        setSelectedMoneyValue(value);
        setActiveButton(value);
        applyButtonStyle(value);
    };

    function generateFixedData(inputDt, moneyValue, content, money, tag, fixedId) {
        const currentDate = new Date();
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, parseInt(inputDt));
        const data = [];

        for (let i = 0; i < 6; i++) {
            const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + i, parseInt(inputDt));
            const newData = {
                moneyValue: moneyValue,
                content: content,
                money: parseFloat(money),
                inputDt: newDate,
                insertDt: new Date(),
                fixedId: fixedId,
                fixedDt: inputDt,
                tag: tag
            };
            data.push(newData);
        }

        return data;
    }

    const handleAddData = () => {
        const fixedId = `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}${new Date().getSeconds().toString().padStart(2, '0')}`;

        // generateFixedData 호출할 때 fixedId 값을 넘겨줌
        const fixedData = generateFixedData(inputFixedDt, selectedMoneyValue, inputContentValue, inputMoneyValue, inputTagValue, fixedId);
        
        const fixedCoinData = {
            moneyValue: selectedMoneyValue,
            content: inputContentValue,
            money: parseFloat(inputMoneyValue),
            insertDt: new Date(),
            fixedDt: inputFixedDt,
            fixedId: fixedId,
            tag: inputTagValue,
            startDt:fixedData[0].inputDt,
            lastDt: fixedData[5].inputDt,
        };
        
        // 원래 데이터를 추가하는 처리
        fixedData.forEach(newData => {
            onAddData(newData);
        });

        // 고정 지출입 데이터를 추가하는 처리
        onFixedAddData(fixedCoinData);        

        // 입력값 초기화
        setSelectedMoneyValue('수입');
        setContentValue('');
        setMoneyValue('');
        setFixedValue('01');
        setTagValue('');
    };

    const handleDeleteFixedData = (id, moneyValue, fixedId) => {
        onDeleteData(id, moneyValue, fixedId);
    };

    const fixedDtOptions = ['01', '10', '15', '20', '25'];

    const windowWidth = window.innerWidth;

    // 날짜포맷 수정
    const formatDate = (date) => {
      const optionsDt = { year: 'numeric', month: '2-digit', day: '2-digit' };
      if (windowWidth >= 1024) {
        return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' }).replace(/\./g, '-').slice(0, -1);
      } else if (windowWidth >= 768 && windowWidth < 1024) {
          return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' }).replace(/\./g, '-').slice(0, -1);
      } else {
            return new Date(date).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit' }).replace(/\./g, '-').slice(0, -1);
        }
    };

    return(
        <div>
            <div className={stylesFixed.dtCategoryBtnDiv}>
                <button className={`${stylesFixed.dtCategoryBtn} ${filterValue === '전체' ? stylesFixed.activeBtn : ''}`} type='button' onClick={() => { setFilterValue('전체');}}>전체</button>
                <button className={`${stylesFixed.dtCategoryBtn} ${filterValue === '수입' ? stylesFixed.activeBtn : ''}`} type='button' onClick={() => { setFilterValue('수입');}}>수입</button>
                <button className={`${stylesFixed.dtCategoryBtn} ${filterValue === '지출' ? stylesFixed.activeBtn : ''}`} type='button' onClick={() => { setFilterValue('지출');}}>지출</button>
            </div>

            <div className={stylesFixed.contentDiv}>
                <h3 className={stylesFixed.subTitle}>새로운 고정 지출입 추가하기</h3>
                <span className={stylesFixed.notice}>&#40; &#8251;고정지출은 익월부터 6개월 등록 됩니다. 참고해주세요.&#41;</span>

                <div className={stylesFixed.newInput}>
                    <table className={stylesFixed.inputTable}>
                        <tbody>
                            <tr>
                                <th>지출입</th>
                                {window.innerWidth <= 767 ? (
                                    <td className={stylesFixed.moneyValueBtnDiv}>
                                        <button className={`${stylesFixed.moneyValueBtn} ${activeButton === '수입' ? stylesFixed.moneyValueBtnActive : ''}`} onClick={() => handleMoneyValueButtonClick('수입')}>수입</button>
                                        <button className={`${stylesFixed.moneyValueBtn} ${activeButton === '지출' ? stylesFixed.moneyValueBtnActive : ''}`} onClick={() => handleMoneyValueButtonClick('지출')}>지출</button>
                                    </td>
                                    ) : (
                                    <td>
                                        <select className={stylesFixed.tableSelect} value={selectedMoneyValue} onChange={(e) => setSelectedMoneyValue(e.target.value)}>
                                            <option value="수입">수입</option>
                                            <option value="지출">지출</option>
                                        </select>
                                    </td>
                                )}

                                <th>내역</th>
                                <td><input className={stylesFixed.tableInput} type="text" value={inputContentValue} onChange={e => setContentValue(e.target.value)} placeholder="내역을 입력해주세요." /></td>
                                
                                <th>금액</th>
                                <td><input className={stylesFixed.tableInput} type="text" value={inputMoneyValue} onChange={e => setMoneyValue(e.target.value)} placeholder="금액을 입력해주세요." /> 원</td>
                                
                                <th>날짜</th>
                                <td>
                                    <select value={inputFixedDt} onChange={e => setFixedValue(e.target.value)}>
                                        {fixedDtOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>

                                <th>태그</th>
                                <td>#<input className={stylesFixed.tableInput} type="text" value={inputTagValue} onChange={e => setTagValue(e.target.value)} placeholder="태그를 입력해주세요."/></td>
                            </tr>
                        </tbody>
                    </table>

                    <button className={stylesFixed.addBtn} type='button' onClick={handleAddData}>추가하기</button>
                </div>
            </div>

            <div>
                <h3 className={stylesFixed.subTitle}>고정 지출입 내역</h3>

                <div className={stylesFixed.lastList}>
                    <table className={stylesFixed.lastListTable}>
                        <thead>
                        <tr>
                            <th>지출입</th>
                            <th>내역</th>
                            <th>금액</th>
                            <th>고정일자</th>
                            <th>태그</th>
                            <th>시작월</th>
                            <th>종료월</th>
                        </tr>
                        </thead>

                        <tbody>
                            {fixedData
                                .filter(item => filterValue === '전체' || item.moneyValue === filterValue)
                                .sort((a, b) => b.insertDt.toDate() - a.insertDt.toDate()) // 정렬 추가
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.moneyValue}</td>
                                        <td className={stylesFixed.dataOver}>{item.content}</td>
                                        <td>{item.money}</td>
                                        <td>{item.fixedDt}</td>
                                        <td className={stylesFixed.dataOver}>{item.tag}</td>
                                        <td>{formatDate(item.startDt.toDate())}</td>
                                        <td>{formatDate(item.lastDt.toDate())}</td>
                                        <td><button className={stylesFixed.deleteBtn} type='button' onClick={() => handleDeleteFixedData(item.id, item.moneyValue, item.fixedId)}>삭제</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Fixed