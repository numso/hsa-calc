import React, { useState } from 'react'
import styled from 'styled-components'

const NUM_PAY_PERIODS = 24

const getPeriodsLeft = () => {
  const month = new Date().getMonth()
  const day = new Date().getDate()
  return (11 - month) * 2 + 2 - Math.floor(day / 15)
}

const kualis = {
  self: 120000,
  spouse: 240000,
  children: 240000,
  family: 360000
}

const limits = {
  individual: 355000,
  family: 710000
}

export default () => {
  const [type, setType] = useState('')
  const [curr, setCurr] = useState(0)
  const [periodsLeft, setPeriodsLeft] = useState(getPeriodsLeft)
  const type2 = type === 'self' ? 'individual' : 'family'
  const maxContrib = getMaxContrib(
    limits[type2],
    kualis[type],
    curr,
    periodsLeft
  )
  return (
    <>
      <h1>HSA Calculator for 2020</h1>
      <p>(Disclaimer: IANAL. Double check all these numbers pls)</p>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value=''></option>
        <option value='self'>Self</option>
        <option value='spouse'>Spouse</option>
        <option value='children'>(Child)ren</option>
        <option value='family'>Family</option>
      </select>
      {type !== '' && (
        <>
          <hr />
          <Wrapper>
            <Label>IRS Maximum</Label>
            <Value>{fmt(limits[type2])}</Value>
          </Wrapper>
          <Wrapper>
            <Label>Kuali Contribution (annual)</Label>
            <Value>{fmt(kualis[type])}</Value>
          </Wrapper>
          <Wrapper>
            <Label>Kuali Contribution (pay period)</Label>
            <Value>{fmt(kualis[type] / NUM_PAY_PERIODS)}</Value>
          </Wrapper>
          <Wrapper>
            <Label>Current Contribution this year</Label>
            <Value>{fmt(curr)}</Value>
            <input
              type='number'
              value={curr}
              onChange={e => setCurr(e.target.value)}
            />
            <div>
              (put this number in in pennies. no decimals. so $10.00 == 1000
            </div>
          </Wrapper>
          <Wrapper>
            <Label>Pay periods left in year</Label>
            <Value>{periodsLeft}</Value>
            <input
              type='number'
              value={periodsLeft}
              onChange={e => setPeriodsLeft(e.target.value)}
            />
            <div>(this is our best guess; could be wrong on holidays)</div>
          </Wrapper>
          <hr />
          <Wrapper>
            <Label>Max contribution (annual adjusted)</Label>
            <Value>{fmt(maxContrib * NUM_PAY_PERIODS)}</Value>
          </Wrapper>
          <Wrapper>
            <Label>Max contribution (pay period)</Label>
            <Value>{fmt(maxContrib)}</Value>
          </Wrapper>
          <hr />
          <hr />
          <hr />
          <Totals
            kuali={kualis[type]}
            curr={curr}
            periodsLeft={periodsLeft}
            maxContrib={Math.floor(maxContrib)}
          />
        </>
      )}
    </>
  )
}

const Totals = ({ kuali, curr, periodsLeft, maxContrib }) => {
  const kualiPays = (kuali / NUM_PAY_PERIODS) * periodsLeft
  const youPay = maxContrib * periodsLeft
  return (
    <>
      <Wrapper>
        <Label>2020 HSA contributions to date</Label>
        <Value>{fmt(curr)}</Value>
      </Wrapper>
      <Wrapper>
        <Label>Kuali will pay</Label>
        <Value>
          {fmt(kualiPays)} ({fmt(kuali)} / {NUM_PAY_PERIODS} * {periodsLeft})
        </Value>
        <Value>(This value could be wrong if you pay too much)</Value>
      </Wrapper>
      <Wrapper>
        <Label>You will pay</Label>
        <Value>
          {fmt(youPay)} ({fmt(maxContrib)} * {periodsLeft})
        </Value>
      </Wrapper>
      <Wrapper>
        <Label />
        <Value>---------</Value>
      </Wrapper>
      <Wrapper>
        <Label>Total</Label>
        <Value>{fmt(+curr + kualiPays + youPay)}</Value>
      </Wrapper>
    </>
  )
}

const getMaxContrib = (irsMax, kuali, curr, periodsLeft) => {
  const kualiTotal = (kuali / NUM_PAY_PERIODS) * periodsLeft
  const max = irsMax - +curr - kualiTotal
  return Math.max(max / periodsLeft, 0)
}

const fmt = amnt => {
  const amount = Math.floor(amnt || 0)
  let dollars = '' + Math.floor(amount / 100)
  for (let i = dollars.length - 3; i >= 1; i -= 3) {
    dollars = dollars.split('')
    dollars.splice(i, 0, ',')
    dollars = dollars.join('')
  }
  let pennies = '' + (amount % 100)
  while (pennies.length < 2) pennies = `0${pennies}`
  return `$${dollars}.${pennies}`
}

const Wrapper = styled.div`
  display: flex;
`

const Label = styled.label`
  display: inline-block;
  width: 350px;
`
const Value = styled.div`
  padding-right: 48px;
`
