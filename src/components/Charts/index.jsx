import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

function ChartComponent({ sortedTransactions }) {
  const lineChartData = {
    labels: sortedTransactions.map(item => item.date),
    datasets: [
      {
        label: 'Transactions',
        data: sortedTransactions.map(item => item.amount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const spendingData = sortedTransactions.filter(transaction => transaction.type === "expense");
  
  const pieChartData = {
    labels: [...new Set(spendingData.map(item => item.tag))],
    datasets: [{
      data: Object.values(spendingData.reduce((acc, item) => {
        acc[item.tag] = (acc[item.tag] || 0) + item.amount;
        return acc;
      }, {})),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  };

  return (
    <div className="charts-wrapper">
      <div style={{borderRadius:"0.5rem", boxShadow:"0 0 10px rgba(0,0,0,0.1)", width:"100%", padding:"2rem"}}>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line data={lineChartData} />
      </div>
      {spendingData.length > 0 ? (
        <div style={{ borderRadius: "0.5rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)", width: "60%", padding: "2rem" }}>
          <h2>Your Spendings</h2>
          <Pie data={pieChartData} />
        </div>
      ) : (
        <div style={{ borderRadius: "0.5rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)", height:"298px", padding: "2rem", textAlign:"center", fontSize:"0.8rem" }}>
          <p>Looks like you have not spent anything.</p>
        </div>
      )}
    </div>
  );
}

export default ChartComponent;