import  { useEffect, useState } from 'react';
import { Progress, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './FinancialWellnessScore.css';

function FinancialWellnessScore({ userData }) {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    const calculatedScore = calculateScore(userData);
    setScore(calculatedScore.overall);
    setBreakdown(calculatedScore.breakdown);
  }, [userData]);

  const calculateScore = (data) => {
    let budgetAdherence = calculateBudgetAdherence(data.expenses, data.budgets);
    let savingsRate = calculateSavingsRate(data.income, data.expenses);
    let debtToIncomeRatio = calculateDebtToIncomeRatio(data.debts, data.income);
    let emergencyFundStatus = calculateEmergencyFundStatus(data.savings, data.expenses);
    let investmentDiversification = calculateInvestmentDiversification(data.investments);

    let overall = (
      budgetAdherence * 0.25 +
      savingsRate * 0.25 +
      debtToIncomeRatio * 0.2 +
      emergencyFundStatus * 0.2 +
      investmentDiversification * 0.1
    ) * 100;

    return {
      overall: Math.round(overall),
      breakdown: {
        budgetAdherence,
        savingsRate,
        debtToIncomeRatio,
        emergencyFundStatus,
        investmentDiversification
      }
    };
  };

  const calculateBudgetAdherence = (expenses, budgets) => {
    // Implementation details
    return 0.8; // Placeholder value
  };

  const calculateSavingsRate = (income, expenses) => {
    // Implementation details
    return 0.15; // Placeholder value
  };

  const calculateDebtToIncomeRatio = (debts, income) => {
    // Implementation details
    return 0.7; // Placeholder value
  };

  const calculateEmergencyFundStatus = (savings, expenses) => {
    // Implementation details
    return 0.6; // Placeholder value
  };

  const calculateInvestmentDiversification = (investments) => {
    // Implementation details
    return 0.5; // Placeholder value
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  return (
    <div className="financial-wellness-score">
      <h2>Financial Wellness Score</h2>
      <Tooltip title="This score represents your overall financial health based on various factors">
        <InfoCircleOutlined style={{ marginLeft: '8px' }} />
      </Tooltip>
      <Progress
        type="circle"
        percent={score}
        format={(percent) => `${percent}`}
        strokeColor={getScoreColor(score)}
        width={120}
      />
      <div className="score-breakdown">
        <h3>Score Breakdown</h3>
        <ul>
          {Object.entries(breakdown).map(([key, value]) => (
            <li key={key}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: {Math.round(value * 100)}%
            </li>
          ))}
        </ul>
      </div>
      <div className="recommendations">
        <h3>Recommendations</h3>
        <ul>
          {score < 60 && <li>Consider reducing non-essential expenses to improve your savings rate.</li>}
          {breakdown.debtToIncomeRatio < 0.5 && <li>Focus on paying down high-interest debt to improve your debt-to-income ratio.</li>}
          {breakdown.emergencyFundStatus < 0.5 && <li>Try to build up your emergency fund to cover 3-6 months of expenses.</li>}
          {breakdown.investmentDiversification < 0.7 && <li>Consider diversifying your investment portfolio to reduce risk.</li>}
        </ul>
      </div>
    </div>
  );
}

export default FinancialWellnessScore;