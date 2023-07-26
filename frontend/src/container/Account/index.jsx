import React from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { createForm  } from 'rc-form';
import Header from '@/components/Header'
import { post } from '@/utils'

import s from './style.module.less'

const Account = (props) => {
  // Account 通过 createForm 高阶组件包裹之后，可以在 props 中获取到 form 属性
  const { getFieldProps, getFieldError } = props.form;

  // 提交修改方法
  const submit = () => {
    // validateFields 获取表单属性元素
    props.form.validateFields(async (error, value) => {
      // error 表单验证全部通过，为 false，否则为 true
      if (!error) {
        console.log(value)
        if (value.newpass != value.newpass2) {
          Toast.show('Passwords do not match');
          return
        }
        await post('/api/user/modify_pass', {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.newpass2
        })
        Toast.show('Success')
      }
    });
  }

  return <>
    <Header title="Reset Password" />
    <div className={s.account}>
      <div className={s.form}>
        <Cell title="Original Password">
          <Input
            clearable
            type="text"
            placeholder="     Please enter your original password"
            {...getFieldProps('oldpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="New Password">
          <Input
            clearable
            type="text"
            placeholder="     Please enter your new password"
            {...getFieldProps('newpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="Confirm Password">
          <Input
            clearable
            type="text"
            placeholder="     Please re-enter your new password"
            {...getFieldProps('newpass2', { rules: [{ required: true }] })}
          />
        </Cell>
      </div>
      <Button className={s.btn} block theme="primary" onClick={submit}>Submit</Button>
    </div>
  </>
};

export default createForm()(Account);

