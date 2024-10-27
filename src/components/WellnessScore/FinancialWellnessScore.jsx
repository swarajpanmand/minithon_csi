import React, { useEffect, useState } from 'react';
import { Progress, Tooltip, Card, Row, Col, List, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './FinancialWellnessScore.css';

const { Title, Text } = Typography;

const FinancialWellnessScore = ({ transactions }) => {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    const calculatedScore = calculateScore(transactions);
    setScore(calculatedScore.overall);
    setBreakdown(calculatedScore.breakdown);
  }, [transactions]);

  const calculateScore = (transactions) => {
    // Calculate monthly data
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.substring(0, 7); // Get YYYY-MM
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    }, {});

    // Calculate metrics
    const budgetAdherence = calculateBudgetAdherence(monthlyData);
    const savingsRate = calculateSavingsRate(monthlyData);
    const expenseStability = calculateExpenseStability(monthlyData);
    const incomeStability = calculateIncomeStability(monthlyData);
    const expenseDiversification = calculateExpenseDiversification(transactions);

    const overall = (
      budgetAdherence * 0.25 +
      savingsRate * 0.25 +
      expenseStability * 0.2 +
      incomeStability * 0.2 +
      expenseDiversification * 0.1
    ) * 100;

    return {
      overall: Math.round(overall),
      breakdown: {
        budgetAdherence,
        savingsRate,
        expenseStability,
        incomeStability,
        expenseDiversification
      }
    };
  };

  const calculateBudgetAdherence = (monthlyData) => {
    const months = Object.keys(monthlyData);
    if (months.length < 2) return 0;

    let adherenceScore = 0;
    const latestMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const currentExpenses = monthlyData[latestMonth].expenses;
    const previousExpenses = monthlyData[previousMonth].expenses;
    
    // Calculate how well expenses stick to previous month's pattern
    const variance = Math.abs(currentExpenses - previousExpenses) / previousExpenses;
    adherenceScore = Math.max(0, 1 - variance);
    
    return adherenceScore;
  };

  const calculateSavingsRate = (monthlyData) => {
    const months = Object.keys(monthlyData);
    if (months.length === 0) return 0;

    let totalIncome = 0;
    let totalExpenses = 0;

    months.forEach(month => {
      totalIncome += monthlyData[month].income;
      totalExpenses += monthlyData[month].expenses;
    });

    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    return Math.max(0, Math.min(1, savingsRate));
  };

  const calculateExpenseStability = (monthlyData) => {
    const months = Object.keys(monthlyData);
    if (months.length < 2) return 0;

    const expenses = months.map(month => monthlyData[month].expenses);
    const avgExpense = expenses.reduce((a, b) => a + b, 0) / expenses.length;
    const variance = expenses.reduce((acc, exp) => 
      acc + Math.pow(exp - avgExpense, 2), 0) / expenses.length;
    
    return Math.max(0, 1 - (Math.sqrt(variance) / avgExpense));
  };

  const calculateIncomeStability = (monthlyData) => {
    const months = Object.keys(monthlyData);
    if (months.length < 2) return 0;

    const incomes = months.map(month => monthlyData[month].income);
    const avgIncome = incomes.reduce((a, b) => a + b, 0) / incomes.length;
    const variance = incomes.reduce((acc, inc) => 
      acc + Math.pow(inc - avgIncome, 2), 0) / incomes.length;
    
    return Math.max(0, 1 - (Math.sqrt(variance) / avgIncome));
  };

  const calculateExpenseDiversification = (transactions) => {
    const expensesByTag = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.tag] = (acc[t.tag] || 0) + 1;
        return acc;
      }, {});

    const tagCount = Object.keys(expensesByTag).length;
    return Math.min(1, tagCount / 10);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  const getRecommendations = () => {
    const recommendations = [];
    if (score < 60) {
      recommendations.push('Consider reducing non-essential expenses to improve your savings rate.');
    }
    if (breakdown.budgetAdherence < 0.6) {
      recommendations.push('Try to maintain more consistent monthly spending patterns.');
    }
    if (breakdown.savingsRate < 0.2) {
      recommendations.push('Aim to save at least 20% of your monthly income.');
    }
    if (breakdown.expenseDiversification < 0.5) {
      recommendations.push('Consider categorizing your expenses more precisely for better tracking.');
    }
    return recommendations;
  };

  return (
    <Card className="financial-wellness-score">
      <Row>
        <Col span={24}>
          <Title level={2} style={{ marginBottom: 16 }}>
            Financial Wellness Score
            <Tooltip title="This score represents your overall financial health based on your transaction history">
              <InfoCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </Title>
        </Col>
      </Row>

      <Row justify="center" className="progress-wrapper">
        <Col>
          <Progress
            type="circle"
            percent={score}
            format={percent => `${percent}`}
            strokeColor={getScoreColor(score)}
            width={120}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={3}>Score Breakdown</Title>
          <List
            dataSource={Object.entries(breakdown)}
            renderItem={([key, value]) => (
              <List.Item style={{ justifyContent: 'space-between' }}>
                <Text>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                <Text strong>{Math.round(value * 100)}%</Text>
              </List.Item>
            )}
          />
        </Col>

        <Col span={24}>
          <Title level={3}>Recommendations</Title>
          <List
            dataSource={getRecommendations()}
            renderItem={recommendation => (
              <List.Item>
                <Text>{recommendation}</Text>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default FinancialWellnessScore;