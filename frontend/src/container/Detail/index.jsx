import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Modal, Toast } from 'zarm';
import qs from 'query-string';
import cx from 'classnames';
import dayjs from 'dayjs';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill'
import { get, post, typeMap } from '@/utils';

import s from './style.module.less'

const Detail = () => {
  const addRef = useRef();
  const location = useLocation();
  const history = useHistory();
  const { id } = qs.parse(location.search);

  const [detail, setDetail] = useState({});
  
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    setDetail(data);
  }

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: 'Delete Bill',
      content: 'Confirm delete?',
      onOk: async () => {
        const { data } = await post('/api/bill/delete', { id })
        Toast.show('Deleted successfully!')
        history.goBack()
      },
    });
  }

  // 打开编辑弹窗方法
  const openModal = () => {
    addRef.current && addRef.current.show()
  }

  return <div className={s.detail}>
    <Header title='Bill details' />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
        </span>
        <span>{ detail.type_name || '' }</span>
      </div>
      {
        detail.pay_type == 1
          ? <div className={cx(s.amount, s.expense)}>-{ detail.amount }</div>
          : <div className={cx(s.amount, s.incom)}>+{ detail.amount }</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>Recorded Date & Time</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>Notes</span>
          <span>{ detail.remark || '-' }</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={deleteDetail}><CustomIcon type='shanchu' />Delete</span>
        <span onClick={openModal}><CustomIcon type='tianjia' />Edit</span>
      </div>
    </div>
    <PopupAddBill ref={addRef} detail={detail} onReload={getDetail} />
  </div>
};

export default Detail;