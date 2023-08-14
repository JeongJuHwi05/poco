import '../reset.css';
import '../css/SpenPatt.css';

import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, BarElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement);

function SpenPatt({ exportData }) {
    // 데이터 로딩 상태를 관리
    const [dataLoaded, setDataLoaded] = useState(false);

    // 현재 월과 년도를 가져오는 함수
    const getCurrentYearMonth = () => {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth()
        };
    };

    const currentYearMonth = getCurrentYearMonth();

    // 조건에 맞는 데이터를 필터링하여 반환하는 함수
    const filterData = (data) => {
        return data.filter(item => {
            const itemYearMonth = {
                year: item.inputDt.toDate().getFullYear(),
                month: item.inputDt.toDate().getMonth()
            };

            return itemYearMonth.year === currentYearMonth.year && itemYearMonth.month === currentYearMonth.month;
        });
    };

    // useEffect를 사용하여 데이터 로딩과 가공을 처리
    useEffect(() => {
        // exportData가 존재하고 dataLoaded가 false일 때
        if (exportData && !dataLoaded) {
            const filteredData = filterData(exportData);
            const tagPercentages = calculateTagPercentages(filteredData);

            // 데이터 로딩이 완료되었으므로 상태 업데이트
            setDataLoaded(true);
        }
    }, [exportData, dataLoaded]);

    const filteredExportData = filterData(exportData);

    // 비중을 소수점 한자리로 변환하는 함수
    const formatPercentage = (percentage) => {
        return percentage.toFixed(1);
    };

    // 태그별로 지출 금액과 백분율을 계산하는 함수
    const calculateTagPercentages = (data) => {
        const tagAmounts = {};

        // 총 금액 계산
        const totalAmount = filteredExportData.reduce((total, item) => total + item.money, 0);

        filteredExportData.forEach(item => {
            const tag = item.tag || '그 외';
            const amount = item.money;

            if (tagAmounts[tag]) {
                tagAmounts[tag].total += amount;
            } else {
                tagAmounts[tag] = {
                    total: amount,
                    percentage: 0
                };
            }
        });

        // 백분율 계산 및 정렬
        const tagPercentages = Object.keys(tagAmounts).map(tag => ({
            tag,
            totalAmount: tagAmounts[tag].total,
            percentage: (tagAmounts[tag].total / totalAmount) * 100
        })).sort((a, b) => b.totalAmount - a.totalAmount);

        // 상위 3개 태그 합치기
        const n = 3;
        if (tagPercentages.length > n) {
            const otherTotalAmount = tagPercentages.slice(n).reduce((total, tagData) => total + tagData.totalAmount, 0);
            tagPercentages.splice(n); // 상위 n개 태그만 남기고 나머지 제거

            // '그 외' 항목 추가
            tagPercentages.push({
                tag: '그 외',
                totalAmount: otherTotalAmount,
                percentage: (otherTotalAmount / totalAmount) * 100
            });
        }

        return tagPercentages;
    };

    const tagPercentages = calculateTagPercentages(filteredExportData);

    // 비중이 작은 순서대로 정렬
    tagPercentages.sort((a, b) => a.percentage - b.percentage);

    const chartOptions = {
        indexAxis: 'y',
        scales: {
            x: {
                type: 'linear',
                beginAtZero: true,
                max: 100,
            },
            y: {
                type: 'category',
                ticks: {
                    display: false, // y축 항목을 표시하지 않음
                },
                stacked: true,
            },
        },
    };

    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
    ];

    const chartData = {
        // 첫 번째 태그만 사용
        labels: [tagPercentages.map(tagData => tagData.tag)[0]],
        datasets: tagPercentages.map((tagData, index) => ({
            label: tagData.tag,
            data: [tagData.percentage],
            backgroundColor: colors[index % colors.length],
            borderWidth: 1
        })),
    };

    return (
        <div>
            {dataLoaded ? (
                <div>
                    <div>
                        <Bar
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>

                    <hr />
                    
                    <h3>태그별 지출 퍼센트</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>태그</th>
                                <th>지출 금액</th>
                                <th>비중</th>
                                <th>색상</th> {/* 색상 열 추가 */}
                            </tr>
                        </thead>
                        <tbody>
                            {tagPercentages.slice().reverse().map((tagData, index) => (
                                <tr key={index}>
                                    <td>{tagData.tag}</td>
                                    <td>{tagData.totalAmount.toLocaleString()}</td>
                                    <td>{formatPercentage(tagData.percentage)} %</td>
                                    <td>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: colors[(tagPercentages.length - 1 - index) % colors.length], // 반대로 색상 선택
                                            }}
                                        ></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default SpenPatt;
