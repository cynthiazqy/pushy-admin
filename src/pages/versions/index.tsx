import { SettingFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Layout, Row, Tabs, Tag, Modal, message, Form } from 'antd';
import { Link, useParams } from 'react-router-dom';
import './index.css';
import PackageList from './packages';
import VersionTable from './versions';
import SettingModal from './settingModal';
import request from '@/services/request';
import { resetAppList } from '@/utils/queryClient';
import { useApp, usePackages } from '@/utils/hooks';

export const Versions = () => {
  const [modal, contextHolder] = Modal.useModal();
  const params = useParams<{ id?: string }>();
  const id = Number(params.id!);
  const { app } = useApp(id);
  const { packages, unused } = usePackages(id);
  const [form] = Form.useForm();
  if (app == null) return null;

  return (
    <>
      {contextHolder}
      <Row className='mb-4'>
        <Form layout='vertical' form={form} initialValues={app}>
          {contextHolder}
          <Col flex={1}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to='/apps'>应用列表</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {app?.name}
                {app?.status === 'paused' && <Tag style={{ marginLeft: 8 }}>暂停</Tag>}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Button.Group>
            <Button
              type='primary'
              icon={<SettingFilled />}
              onClick={() => {
                modal.confirm({
                  icon: null,
                  closable: true,
                  maskClosable: true,
                  content: <SettingModal />,
                  async onOk() {
                    try {
                      const payload = state.app;
                      await request('put', `/app/${app.id}`, {
                        name: payload?.name,
                        downloadUrl: payload?.downloadUrl,
                        status: payload?.status,
                        ignoreBuildTime: payload?.ignoreBuildTime,
                      });
                    } catch (e) {
                      message.error((e as Error).message);
                      return;
                    }
                    // resetAppList();
                    // queryClient.setQueryData(['app', app.id], {...app, });

                    // runInAction(() => {
                    //   if (state.app) {
                    //     app.name = state.app.name;
                    //     // versionPageState.app = state.app;
                    //   }
                    // });
                    message.success('修改成功');
                  },
                });
              }}
            >
              应用设置
            </Button>
          </Button.Group>
        </Form>
      </Row>
      {/* <Row style={{ marginBottom: 16 }}>
        <Col flex={1}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to='/apps'>应用列表</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {app?.name}
              {app?.status === 'paused' && <Tag style={{ marginLeft: 8 }}>暂停</Tag>}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Button.Group>
          <Button
            type='primary'
            icon={<SettingFilled />}
            onClick={() => {
              modal.confirm({
                icon: null,
                closable: true,
                maskClosable: true,
                content: <SettingModal app={app} />,
                async onOk() {
                  try {
                    const payload = state.app;
                    await request('put', `/app/${app.id}`, {
                      name: payload?.name,
                      downloadUrl: payload?.downloadUrl,
                      status: payload?.status,
                      ignoreBuildTime: payload?.ignoreBuildTime,
                    });
                  } catch (e) {
                    message.error((e as Error).message);
                    return;
                  }
                  resetAppList();

                  runInAction(() => {
                    if (state.app) {
                      app.name = state.app.name;
                      // versionPageState.app = state.app;
                    }
                  });
                  message.success('修改成功');
                },
              });
            }}
          >
            应用设置
          </Button>
        </Button.Group> */}

      <Layout>
        <Layout.Sider theme='light' className='p-4 pt-0 mr-4 h-full rounded-lg' width={240}>
          <div className='py-4'>原生包</div>
          <Tabs>
            <Tabs.TabPane tab='全部' key='all'>
              <PackageList dataSource={packages} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='未使用' key='unused'>
              <PackageList dataSource={unused} />
            </Tabs.TabPane>
          </Tabs>
        </Layout.Sider>
        <Layout.Content className='p-0'>
          <VersionTable />
        </Layout.Content>
      </Layout>
    </>
  );
};

export const Component = Versions;
