import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useHistory } from 'react-router-dom'
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils';

import s from './style.module.less';

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const history = useHistory()

  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算。
  useEffect(() => {
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  const goToDetail = (item) => {
    history.push(`/detail?id=${item.id}`)
  };

  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{bill.date}</div>
      <div className={s.money}>
        <span>
          <svg t="1690117342161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6588" width="25" height="25"><path d="M928 160H96a32 32 0 0 0-32 32v672a32 32 0 0 0 32 32h381.44v-64H128V464h832V192a32 32 0 0 0-32-32zM128 400V224h768v176z" p-id="6589"></path><path d="M832 704h-288v64h288v80l128-112-128-112V704z" p-id="6590"></path></svg>
            <span>${ expense.toFixed(2) }</span>
        </span>
        <span>
          <svg t="1690117586318" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7978" width="25" height="25"><path d="M928 160H96a32 32 0 0 0-32 32v672a32 32 0 0 0 32 32h381.44v-64H128V464h832V192a32 32 0 0 0-32-32zM128 400V224h768v176z" p-id="7979"></path><path d="M672 624L544 736l128 112V768h288v-64h-288v-80z" p-id="7980"></path></svg>
          <span>${ income.toFixed(2) }</span>
        </span>
      </div>
    </div>
    {
      bill && bill.bills.sort((a, b) => b.date - a.date).map(item => <Cell
        className={s.bill}
        key={item.id}
        onClick={() => goToDetail(item)}
        title={
          <>
            <CustomIcon
              className={s.itemIcon}
              type={item.type_id ? typeMap[item.type_id].icon : 1}
            />
            <span>{ item.type_name }</span>
          </>
        }
        description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
        help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
      >
      </Cell>)
    }
  </div>
};

BillItem.propTypes = {
  bill: PropTypes.object
};

export default BillItem;

