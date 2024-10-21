import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function BudgetManager({ userData, setUserData }) {
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    // Calculate predictions based on historical data
    const newPredictions = calculatePredictions(userData.expenses);
    setPredictions(newPredictions);
  }, [userData.expenses]);

  const calculatePredictions = (expenses) => {
    // Implement prediction logic here
  };

  const setBudget = (category, amount) => {
    setUserData(prevData => ({
      ...prevData,
      budgets: {
        ...prevData.budgets,
        [category]: amount
      }
    }));
  };

  return (
    <div className="budget-manager">
      <h2>Budget Manager</h2>
      {Object.entries(userData.budgets).map(([category, budget]) => (
        <div key={category} className="budget-item">
          <h3>{category}</h3>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(category, parseFloat(e.target.value))}
          />
          <div className="prediction">
            Predicted spending: ${predictions[category]}
            {predictions[category] > budget && (
              <div className="alert">Warning: Predicted to exceed budget!</div>
            )}
          </div>
        </div>
      ))}
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default BudgetManager;