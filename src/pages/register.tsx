import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Form, Input, message, Row, Checkbox, Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import md5 from 'blueimp-md5';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { isPasswordValid } from '../utils/helper';
import { router, rootRouterPath } from '../router';
import { setUserEmail } from '@/services/auth';
import { api } from '@/services/api';

export const Component = () => {
  let formValues: { [key: string]: string } = {
    email: '',
    pwd: '',
  };
  const { isLoading, error } = useQuery({
    queryKey: ['register', formValues],
    queryFn: () => api.register(formValues),
    enabled: !!formValues?.email && !!formValues?.pwd,
  });

  if (error) {
    return <Result status='error' title={error?.message || '该邮箱已被注册'} />;
  }

  return (
    <div style={style.body}>
      <Form
        style={style.form}
        onFinish={(values) => {
          delete values.pwd2;
          delete values.agreed;
          values.pwd = md5(values.pwd);
          formValues = values;
          setUserEmail(values.email);
          router.navigate(rootRouterPath.welcome);
        }}
      >
        <div style={style.logo}>
          <img src={logo} className='mx-auto' />
          <div style={style.slogan}>极速热更新框架 for React Native</div>
        </div>
        <Form.Item name='name' hasFeedback>
          <Input placeholder='用户名' size='large' required />
        </Form.Item>
        <Form.Item name='email' hasFeedback>
          <Input placeholder='邮箱' size='large' type='email' required />
        </Form.Item>
        <Form.Item
          hasFeedback
          name='pwd'
          validateTrigger='onBlur'
          rules={[
            () => ({
              async validator(_, value) {
                if (value && !isPasswordValid(value)) {
                  throw '密码中需要同时包含大、小写字母和数字，且长度不少于6位';
                }
              },
            }),
          ]}
        >
          <Input type='password' placeholder='密码' size='large' autoComplete='' required />
        </Form.Item>
        <Form.Item
          hasFeedback
          name='pwd2'
          validateTrigger='onBlur'
          rules={[
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if (getFieldValue('pwd') != value) {
                  throw '两次输入的密码不一致';
                }
              },
            }),
          ]}
        >
          <Input type='password' placeholder='再次输入密码' size='large' autoComplete='' required />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' size='large' loading={isLoading} block>
            注册
          </Button>
        </Form.Item>
        <Form.Item>
          <Row justify='space-between'>
            <Form.Item
              name='agreed'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意后勾选此处')),
                },
              ]}
              hasFeedback
              noStyle
            >
              <Checkbox>
                <span>
                  已阅读并同意
                  <a
                    target='_blank'
                    href='https://pushy.reactnative.cn/agreement/'
                    rel='noreferrer'
                  >
                    用户协议
                  </a>
                </span>
              </Checkbox>
            </Form.Item>
            <span />
            <Link to='/login'>已有帐号？</Link>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

const style: Style = {
  body: { display: 'flex', flexDirection: 'column', height: '100%' },
  form: { width: 320, margin: 'auto', paddingTop: 16, flex: 1 },
  logo: { textAlign: 'center', margin: '48px 0' },
  slogan: { marginTop: 16, color: '#00000073', fontSize: 18 },
};
