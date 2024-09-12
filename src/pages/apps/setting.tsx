import { Form, message, Modal, Typography, Switch, Button } from 'antd';

import { DeleteFilled } from '@ant-design/icons';
import { removeApp } from './state';

import versionPageState from '../versions/state';
import request from '../../services/request';
import { useUserInfo } from '@/utils/hooks';

export default function Setting(app: App) {
  request('get', `/app/${app.id}`).then((appData) => {
    runInAction(() => {
      state.app = appData;
    });
  });

  Modal.confirm({
    icon: null,
    closable: true,
    maskClosable: true,
    content: <Content app={app} />,
    async onOk() {
      try {
        const payload = state.app;
        await request('put', `/app/${app.id}`, {
          name: payload.name,
          downloadUrl: payload.downloadUrl,
          status: payload.status,
          ignoreBuildTime: payload.ignoreBuildTime,
        });
      } catch (e) {
        message.error((e as Error).message);
        return;
      }

      runInAction(() => {
        if (state.app) {
          app.name = state.app.name;
          versionPageState.app = state.app;
        }
      });
      message.success('修改成功');
    },
  });
}

const Content = ({ app }: { app: App }) => {
  const { user } = useUserInfo();
  return (
    <Form layout='vertical'>
      <Form.Item label='应用名'>
        <Typography.Paragraph
          type='secondary'
          style={style.item}
          editable={{
            onChange: (value) => runInAction(() => (app.name = value)),
          }}
        >
          {app.name}
        </Typography.Paragraph>
      </Form.Item>
      <Form.Item label='应用 Key'>
        <Typography.Paragraph style={style.item} type='secondary' copyable>
          {app.appKey}
        </Typography.Paragraph>
      </Form.Item>
      <Form.Item label='下载地址'>
        <Typography.Paragraph
          type='secondary'
          style={style.item}
          editable={{
            onChange: (value) => runInAction(() => (app.downloadUrl = value)),
          }}
        >
          {app.downloadUrl ?? ''}
        </Typography.Paragraph>
      </Form.Item>
      <Form.Item label='启用热更新'>
        <Switch
          checkedChildren='启用'
          unCheckedChildren='暂停'
          checked={app.status !== 'paused'}
          onChange={(checked) => runInAction(() => (app.status = checked ? 'normal' : 'paused'))}
        />
      </Form.Item>
      <Form.Item label='忽略编译时间戳（高级版以上可启用）'>
        <Switch
          disabled={
            (user?.tier === 'free' || user?.tier === 'standard') &&
            app.ignoreBuildTime !== 'enabled'
          }
          checkedChildren='启用'
          unCheckedChildren='不启用'
          checked={app.ignoreBuildTime === 'enabled'}
          onChange={(checked) =>
            runInAction(() => (app.ignoreBuildTime = checked ? 'enabled' : 'disabled'))
          }
        />
      </Form.Item>
      <Form.Item label='删除应用'>
        <Button type='primary' icon={<DeleteFilled />} onClick={() => removeApp(app)} danger>
          删除
        </Button>
      </Form.Item>
    </Form>
  );
};

const style: Style = { item: { marginBottom: 0 } };
