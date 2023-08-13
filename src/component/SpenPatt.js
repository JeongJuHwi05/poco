import React from "react";

function SpenPatt({ exportData }) {
    // 태그별 퍼센트를 계산하는 함수
    function calculateTagPercentages(data) {
        const tagAmounts = {};

        // 태그별로 지출 금액을 계산
        data.forEach(item => {
            const tag = item.tag || '그 외'; // 태그가 없는 경우 '그 외'로 분류
            const amount = item.money;

            if (tagAmounts[tag]) {
                tagAmounts[tag] += amount;
            } else {
                tagAmounts[tag] = amount;
            }
        });

        // 전체 지출 금액 계산
        const totalAmount = data.reduce((total, item) => total + item.money, 0);

        // 퍼센트 계산 및 정렬
        const tagPercentages = Object.keys(tagAmounts).map(tag => ({
            tag,
            totalAmount: tagAmounts[tag],
            percentage: (tagAmounts[tag] / totalAmount) * 100
        })).sort((a, b) => b.totalAmount - a.totalAmount);

        return tagPercentages;
    }

    // 돈을 소수점 없이 표시하고, 세 자리마다 쉼표(,)를 넣어주는 함수
    function formatMoney(amount) {
        return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return(
        <header>
            <p>
                <span>SpenPatt</span>
            </p>
            <div>
                <h3>태그별 지출 퍼센트</h3>
                <table>
                    <thead>
                        <tr>
                            <th>태그</th>
                            <th>지출 금액</th>
                            <th>지출 퍼센트</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculateTagPercentages(exportData).map((tagData, index) => (
                            <tr key={index}>
                                <td>{tagData.tag}</td>
                                <td>{formatMoney(tagData.totalAmount)} 원</td>
                                <td>{tagData.percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </header>
    )
}

export default SpenPatt;
