import React from "react";
import { Line, Pie } from "@ant-design/charts";

function ChartComponent({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type == "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  },{});

  const config = {
    data: data,
    height:260,
    width: 800,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  const spendingConfig = {
    data: Object.values(finalSpendings),
    height:260,
    width: 400,
    autoFit: true,
    angleField: "amount", // Assuming 'amount' represents the size of the pie slice
    colorField: "tag", // Assuming 'tag' represents different categories for the pie chart
  };

  let chart;
  let pieChart;
  return (
    <div className="charts-wrapper">
      <div style={{borderRadius:"0.5rem", boxShadow:"var(--shadow)", width:"100%", padding:"2rem"}}>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      {Object.keys(finalSpendings).length > 0 ? (
        <div style={{ borderRadius: "0.5rem", boxShadow: "var(--shadow)", width: "60%", padding: "2rem" }}>
          <h2>Your Spendings</h2>
          <Pie {...spendingConfig} />
        </div>
      ) : (
        <div style={{ borderRadius: "0.5rem", boxShadow: "var(--shadow)", height:"298px", padding: "2rem", textAlign:"center", fontSize:"0.8rem" }}>
          <p>Looks like you have not spent anything.</p>
        </div>
      )}
    </div>
  );
}

export default ChartComponent;
