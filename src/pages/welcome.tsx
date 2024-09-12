import { Button, message, Result } from 'antd';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { router, rootRouterPath } from '../router';
import { api } from '@/services/api';
import { getUserEmail } from '@/services/auth';

export const Component = () => {
  useEffect(() => {
    if (!getUserEmail()) {
      router.navigate(rootRouterPath.login);
    }
  }, []);
  const { mutate: sendEmail, isPending } = useMutation({
    mutationFn: () => api.sendEmail({ email: getUserEmail() }),
    onSuccess: () => {
      message.info('邮件发送成功，请注意查收');
    },
    onError: () => {
      message.error('邮件发送失败');
    },
  });

  return (
    <Result
      title={
        <>
          感谢您关注由 React Native 中文网提供的热更新服务
          <br />
          我们已经往您的邮箱发送了一封激活邮件
          <br />
          请点击邮件内的激活链接激活您的帐号
          <div style={{ height: 24 }} />
        </>
      }
      subTitle='如未收到激活邮件，请点击'
      extra={
        <Button type='primary' onClick={() => sendEmail()} loading={isPending}>
          重新发送
        </Button>
      }
    />
  );
};
