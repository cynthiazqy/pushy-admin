import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useLocation } from 'react-router-dom';
import md5 from 'blueimp-md5';
import { isPasswordValid } from '../../utils/helper';
import { router, rootRouterPath } from '../../router';
import request from '../../services/request';

export default function SetPassword() {
  const { search } = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Form
      className='m-auto w-80'
      onFinish={async (values) => {
        setLoading(true);
        try {
          delete values.pwd2;
          values.token = new URLSearchParams(search).get('code');
          values.newPwd = md5(values.newPwd);
          await request('post', '/user/resetpwd/reset', values);
          router.navigate(rootRouterPath.resetPassword('3'));
        } catch (e) {
          console.log(e);
          message.error((e as Error).message ?? '网络错误');
        }
        setLoading(false);
      }}
    >
      <Form.Item
        hasFeedback
        name='newPwd'
        validateTrigger='onBlur'
        rules={[
          () => ({
            validator(_, value: string) {
              if (value && !isPasswordValid(value)) {
                throw new Error('密码中需要同时包含大、小写字母和数字，且长度不少于6位');
              }
            },
          }),
        ]}
      >
        <Input type='password' placeholder='新密码' autoComplete='' required />
      </Form.Item>
      <Form.Item
        hasFeedback
        name='pwd2'
        validateTrigger='onBlur'
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value: string) {
              if (getFieldValue('newPwd') !== value) {
                throw new Error('两次输入的密码不一致');
              }
            },
          }),
        ]}
      >
        <Input type='password' placeholder='再次输入密码' autoComplete='' required />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading} block>
          确认修改
        </Button>
      </Form.Item>
    </Form>
  );
}

export const Component = SetPassword;
