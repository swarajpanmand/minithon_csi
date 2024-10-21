import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";

function Cards({income, expense, totalBalance, showIncomeModal, showExpenseModal, resetBalance}) {
  return (
    <div>
      <Row className="my-row">
        <Card bordered={true} className="my-card card-blue">
          <h2>Balance</h2>
          <p>₹{totalBalance}</p>
          <Button text="Reset Balance" onClick={resetBalance}/>
        </Card>
        <Card bordered={true} className="my-card card-green">
          <h2>Income</h2>
          <p>₹{income}</p>
          <Button text="Add Income" onClick={showIncomeModal} blue={false}/>
        </Card>
        <Card bordered={true} className="my-card card-red">
          <h2>Expenses</h2>
          <p>₹{expense}</p> 
          <Button text="Add Expenses" onClick={showExpenseModal} blue={false}/>
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
