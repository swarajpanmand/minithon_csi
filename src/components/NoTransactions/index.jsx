import React from "react";
import transactions from "../../assets/cards.png";

function NoTransactions() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
        marginTop: "-3rem",
      }}
    >
      <img
        src={transactions}
        alt=""
        style={{ width: "330px" }}
      />
      <p style={{ textAlign: "center", fontSize: "0.85rem" }}>
        You have no transactions currently!
      </p>
    </div>
  );
}

export default NoTransactions;
