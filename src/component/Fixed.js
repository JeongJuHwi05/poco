import '../css/Fixed.css';
import '../reset.css';

import React, { useState } from 'react';

function Fixed({ fixedData, onAddData, onFixedAddData, onDeleteData }) {

    const [selectedMoneyValue, setSelectedMoneyValue] = useState('수입');
    const [inputContentValue, setContentValue] = useState('');
    const [inputFixedDt, setFixedValue] = useState('01');
    const [inputMoneyValue, setMoneyValue] = useState('');
    const [inputTagValue, setTagValue] = useState('');
    const [filterValue, setFilterValue] = useState('전체');

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

    // 날짜포맷 수정
    const formatDate = (date) => {
        const optionsDt = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('ko-KR', optionsDt).replace(/ /g, '').replace(/\./g, '-').slice(0, -4);
    };

    return(
        <div className='fixedApp'>
            <div>
                <div>
                    <button type='button' onClick={() => setFilterValue('전체')}>전체</button>
                    <button type='button' onClick={() => setFilterValue('수입')}>수입</button>
                    <button type='button' onClick={() => setFilterValue('지출')}>지출</button>
                </div>
            </div>

            <div className='contentDiv'>

                <h3 className='subTitle'>새로운 고정 지출입 추가하기</h3>
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
                            <td>
                                <select value={inputFixedDt} onChange={e => setFixedValue(e.target.value)}>
                                    {fixedDtOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td>#<input type="text" value={inputTagValue} onChange={e => setTagValue(e.target.value)} placeholder="태그를 입력해주세요."/></td>
                            </tr>
                        </tbody>
                    </table>

                    <button type='button' onClick={handleAddData}>추가하기</button>
                </div>
            </div>

            <div>
                <h3 className='subTitle'>고정 지출입 내역</h3>

                <div className='lastList'>
                    <table className="">
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
                                        <td>{item.content}</td>
                                        <td>{item.money}</td>
                                        <td>매월 {item.fixedDt}</td>
                                        <td>{item.tag}</td>
                                        <td>{formatDate(item.startDt.toDate())}</td>
                                        <td>{formatDate(item.lastDt.toDate())}</td>
                                        <td><button type='button' onClick={() => handleDeleteFixedData(item.id, item.moneyValue, item.fixedId)}>삭제</button></td>
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