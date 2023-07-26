import React, { useEffect, useRef, useState } from 'react';
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import { get, typeMap } from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import s from './style.module.less';

let proportionChart = null

const  Data = () => {
  const monthRef = useRef();
  const [totalType, setTotalType] = useState('expense');
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [pieType, setPieType] = useState('expense');

  useEffect(() => {
    getData()
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose();
    }
  }, [currentMonth]);
  
  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);
  
    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);
  
    // 过滤支出和收入
    const expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a, b) => b.number - a.number); // 过滤出账单类型为支出的项
    const income_data = data.total_data.filter(item => item.pay_type == 2).sort((a, b) => b.number - a.number); // 过滤出账单类型为收入的项
    setExpenseData(expense_data);
    setIncomeData(income_data);
    setPieChart(pieType == 'expense' ? expense_data : income_data, pieType);
  };
  
  // 切换收支构成类型
  const changeTotalType = (type) => {
    setTotalType(type)
  }

  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData, type);
  }

  // 绘制饼图方法
  const setPieChart = (data, type) => {
    if (window.echarts) {
      proportionChart = echarts.init(document.getElementById('proportion'));
      proportionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // 图例
          legend: {
              data: data.map(item => item.type_name)
          },
          series: [
            {
              name: type.toUpperCase(),
              // name: "Expense",
              type: 'pie',
              radius: '55%',
              data: data.map(item => {
                return {
                  value: item.number,
                  name: item.type_name
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      })
    }
  }

  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show()
  }

  const selectMonth = (item) => {
    setCurrentMonth(item)
  }

  return <div className={s.data}>
    <div className={s.total}>
      <div className={s.time} onClick={monthShow}>
        <span>{currentMonth}</span>
        <svg t="1690116809962" className={s.date} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3444" width="25" height="25"><path d="M384 128v64h256V128h64v64h192v704H128V192h192V128h64z m448 320H192v384h640V448z m-181.824 40.608l43.648 46.784-205.76 192a32 32 0 0 1-43.648 0l-114.24-106.56 43.648-46.816 92.416 86.208 183.936-171.616zM320 256H192v128h640V256h-128v64h-64V256h-256v64h-64V256z" fill="#000000" p-id="3445"></path></svg>
      </div>
      <div className={s.title}>Total Expense</div>
      <div className={s.expense}>${ totalExpense }</div>
      <div className={s.income}>Total Income${ totalIncome }</div>
    </div>
    <div className={s.structure}>
      <div className={s.head}>
        <span className={s.title}>Overview</span>
        <div className={s.tab}>
          <span onClick={() => changeTotalType('expense')} className={cx({ [s.expense]: true, [s.active]: totalType == 'expense' })}>Expense</span>
          <span onClick={() => changeTotalType('income')} className={cx({ [s.income]: true, [s.active]: totalType == 'income' })}>Income</span>
        </div>
      </div>
      <div className={s.content}>
        {
          (totalType == 'expense' ? expenseData : incomeData).map(item => <div key={item.type_id} className={s.item}>
            <div className={s.left}>
              <div className={s.type}>
                <span className={cx({ [s.expense]: totalType == 'expense', [s.income]: totalType == 'income' })}>
                  <CustomIcon
                    type={item.type_id ? typeMap[item.type_id].icon : 1}
                  />
                </span>
                <span className={s.name}>{ item.type_name }</span>
              </div>
              <div className={s.progress}>${ Number(item.number).toFixed(2) || 0 }</div>
            </div>
            <div className={s.right}>
              <div className={s.percent}>
                <Progress
                  shape="line"
                  percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                  theme='primary'
                />
              </div>
            </div>
          </div>)
        }
      </div>
      <div className={s.proportion}>
        <div className={s.head}>
          <span className={s.title}>Chart</span>
          <div className={s.tab}>
            <span onClick={() => changePieType('expense')} className={cx({ [s.expense]: true, [s.active]: pieType == 'expense'  })}>Expense</span>
            <span onClick={() => changePieType('income')} className={cx({ [s.income]: true, [s.active]: pieType == 'income'  })}>Income</span>
          </div>
        </div>
        <div id="proportion"></div>
      </div>
    </div>
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
  </div>
}

export default Data;