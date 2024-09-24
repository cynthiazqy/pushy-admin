import { Form, Modal, Typography, Switch, Button, Input } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { useUserInfo } from '@/utils/hooks';
import { api } from '@/services/api';
import { rootRouterPath, router } from '@/router';
import { resetAppList } from '@/utils/queryClient';

const SettingModal = (app: App) => {
  const { user } = useUserInfo();
  const [form] = Form.useForm();

  return (
    <>
      <Form.Item label='应用名' name='name'>
        <Input />
      </Form.Item>
      <Form.Item label='应用 Key' name='appKey'>
        <Typography.Paragraph style={style.item} type='secondary' copyable>
          {form.getFieldValue('appKey')}
        </Typography.Paragraph>
      </Form.Item>
      <Form.Item label='下载地址' name='downloadUrl'>
        <Input />
      </Form.Item>
      <Form.Item label='启用热更新' name='status'>
        <Switch
          checkedChildren='启用'
          unCheckedChildren='暂停'
          checked={app?.status !== 'paused'}
          onChange={(checked) => (app?.status = checked ? 'normal' : 'paused')}
        />
      </Form.Item>
      <Form.Item label='忽略编译时间戳（高级版以上可启用）' name='ignoreBuildTime'>
        <Switch
          disabled={
            (user?.tier === 'free' || user?.tier === 'standard') &&
            app?.ignoreBuildTime !== 'enabled'
          }
          checkedChildren='启用'
          unCheckedChildren='不启用'
          checked={app?.ignoreBuildTime === 'enabled'}
          onChange={(checked) => (app?.ignoreBuildTime = checked ? 'enabled' : 'disabled')}
        />
      </Form.Item>
      <Form.Item label='删除应用'>
        <Button
          type='primary'
          icon={<DeleteFilled />}
          onClick={() => {
            Modal.confirm({
              title: '应用删除后无法恢复',
              okText: '确认删除',
              okButtonProps: { danger: true },
              async onOk() {
                await api.deleteApp(form.getFieldValue('id'));
                Modal.destroyAll();
                resetAppList();
                router.navigate(rootRouterPath.apps);
              },
            });
          }}
          danger
        >
          删除
        </Button>
      </Form.Item>
    </>
  );
};

export default SettingModal;

const style: Style = { item: { marginBottom: 0 } };
