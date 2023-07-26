import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Cell, Modal, Input, Button, Toast, FilePicker } from 'zarm';
import { get, post, imgUrlTrans } from '@/utils';

import s from './style.module.less';

const User = () => {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [signature, setSignature] = useState('');
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo');
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar))
    setSignature(data.signature)
  };

  // 个性签名弹窗确认
  const confirmSig = async () => {
    const { data } = await post('/api/user/edit_signature', {
      signature: signature
    });
    setUser(data);
    setShow(false);
    Toast.show('Modified successfully');
  } ;

  // 退出登录
  const logout = async () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>Nickname: { user.username }</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{ user.signature || 'No Data' }</b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={avatar} alt="" />
   </div>
   <div className={s.content}>
    <Cell
      hasArrow
      title="Edit User Info"
      onClick={() => history.push('/userinfo')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
    />
    <Cell
      hasArrow
      title="Reset Password"
      onClick={() => history.push('/account')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
    />
    {/* <Cell
      hasArrow
      title="我的标签"
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1619321650235/mytag.png" alt="" />}
    /> */}
    <Cell
      hasArrow
      title="About the Author"
      onClick={() => history.push('/about')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
    />
   </div>
   <Button className={s.logout} block theme="danger" onClick={logout}>Log Out</Button>
   <Modal
      visible={show}
      title="Title"
      closable
      onCancel={() => setShow(false)}
      footer={
        <Button block theme="primary" onClick={confirmSig}>
          Confirm
        </Button>
      }
    >
    <Input
        autoHeight
        showLength
        maxLength={50}
        type="text"
        rows={3}
        value={signature}
        placeholder="Enter additional notes"
        onChange={(val) => setSignature(val)}
        />
    </Modal>
  </div>
};

export default User;