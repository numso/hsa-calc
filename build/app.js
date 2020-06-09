import React, { useState } from 'https://cdn.pika.dev/react';
import styled from 'https://cdn.pika.dev/styled-components';
const NUM_PAY_PERIODS = 24;

const getPeriodsLeft = () => {
  const month = new Date().getMonth();
  const day = new Date().getDate();
  return (11 - month) * 2 + 2 - Math.floor(day / 15);
};

const kualis = {
  self: 120000,
  spouse: 240000,
  children: 240000,
  family: 360000
};
const limits = {
  individual: 355000,
  family: 710000
};
export default (() => {
  const [type, setType] = useState('');
  const [curr, setCurr] = useState(0);
  const [periodsLeft, setPeriodsLeft] = useState(getPeriodsLeft);
  const type2 = type === 'self' ? 'individual' : 'family';
  const maxContrib = getMaxContrib(limits[type2], kualis[type], curr, periodsLeft);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "HSA Calculator for 2020"), /*#__PURE__*/React.createElement("p", null, "(Disclaimer: IANAL. Double check all these numbers pls)"), /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }), /*#__PURE__*/React.createElement("option", {
    value: "self"
  }, "Self"), /*#__PURE__*/React.createElement("option", {
    value: "spouse"
  }, "Spouse"), /*#__PURE__*/React.createElement("option", {
    value: "children"
  }, "(Child)ren"), /*#__PURE__*/React.createElement("option", {
    value: "family"
  }, "Family")), type !== '' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "IRS Maximum"), /*#__PURE__*/React.createElement(Value, null, fmt(limits[type2]))), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Kuali Contribution (annual)"), /*#__PURE__*/React.createElement(Value, null, fmt(kualis[type]))), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Kuali Contribution (pay period)"), /*#__PURE__*/React.createElement(Value, null, fmt(kualis[type] / NUM_PAY_PERIODS))), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Current Contribution this year"), /*#__PURE__*/React.createElement(Value, null, fmt(curr)), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: curr,
    onChange: e => setCurr(e.target.value)
  })), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Pay periods left in year"), /*#__PURE__*/React.createElement(Value, null, periodsLeft), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: periodsLeft,
    onChange: e => setPeriodsLeft(e.target.value)
  }), /*#__PURE__*/React.createElement("div", null, "(this is our best guess; could be wrong)")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Max contribution (annual adjusted)"), /*#__PURE__*/React.createElement(Value, null, fmt(maxContrib * NUM_PAY_PERIODS))), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Max contribution (pay period)"), /*#__PURE__*/React.createElement(Value, null, fmt(maxContrib))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Totals, {
    kuali: kualis[type],
    curr: curr,
    periodsLeft: periodsLeft,
    maxContrib: Math.floor(maxContrib)
  })));
});

const Totals = ({
  kuali,
  curr,
  periodsLeft,
  maxContrib
}) => {
  const kualiPays = kuali / NUM_PAY_PERIODS * periodsLeft;
  const youPay = maxContrib * periodsLeft;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "This year you've paid"), /*#__PURE__*/React.createElement(Value, null, fmt(curr))), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Kuali will pay"), /*#__PURE__*/React.createElement(Value, null, fmt(kualiPays), " (", fmt(kuali), " / ", NUM_PAY_PERIODS, " * ", periodsLeft, ")"), /*#__PURE__*/React.createElement(Value, null, "(This value could be wrong if you pay too much)")), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "You will pay"), /*#__PURE__*/React.createElement(Value, null, fmt(youPay), " (", fmt(maxContrib), " * ", periodsLeft, ")")), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null), /*#__PURE__*/React.createElement(Value, null, "---------")), /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Label, null, "Total"), /*#__PURE__*/React.createElement(Value, null, fmt(+curr + kualiPays + youPay))));
};

const getMaxContrib = (irsMax, kuali, curr, periodsLeft) => {
  const kualiTotal = kuali / NUM_PAY_PERIODS * periodsLeft;
  const max = irsMax - +curr - kualiTotal;
  return Math.max(max / periodsLeft, 0);
};

const fmt = amnt => {
  const amount = Math.floor(amnt || 0);
  let dollars = '' + Math.floor(amount / 100);

  for (let i = dollars.length - 3; i >= 1; i -= 3) {
    dollars = dollars.split('');
    dollars.splice(i, 0, ',');
    dollars = dollars.join('');
  }

  let pennies = '' + amount % 100;

  while (pennies.length < 2) pennies = `0${pennies}`;

  return `$${dollars}.${pennies}`;
};

const Wrapper = styled.div`
  display: flex;
`;
const Label = styled.label`
  display: inline-block;
  width: 350px;
`;
const Value = styled.div`
  padding-right: 48px;
`;