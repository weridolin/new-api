import React, { useEffect, useState } from 'react';
import { SideSheet, Button, Spin, Typography, Collapsible } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { API, showError, showSuccess } from '../../../../helpers';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function LogContentDrawer({ visible, onClose, requestId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (visible && requestId) {
      setLoading(true);
      setData(null);
      API.get(`/api/log/content/0?request_id=${encodeURIComponent(requestId)}`)
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            setData(data);
          } else {
            showError(data?.message || t('获取内容失败'));
          }
        })
        .catch(() => {
          showError(t('获取内容失败'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, requestId, t]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess(t('已复制到剪贴板'));
    });
  };

  const formatJson = (str) => {
    if (!str) return '';
    try {
      const obj = JSON.parse(str);
      return JSON.stringify(obj, null, 2);
    } catch {
      return str;
    }
  };

  return (
    <SideSheet
      title={t('调用详情')}
      visible={visible}
      onCancel={onClose}
      width={600}
      placement='right'
    >
      <Spin spinning={loading}>
        {!data ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type='tertiary'>{t('未记录输入输出内容')}</Text>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Collapsible defaultOpen>
              <Collapsible.Header>
                <Title heading={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t('输入内容')}
                  {data.input_content && (
                    <Button
                      icon={<IconCopy />}
                      size='small'
                      onClick={() => copyToClipboard(data.input_content)}
                    />
                  )}
                </Title>
              </Collapsible.Header>
              <Collapsible.Body>
                <pre
                  style={{
                    background: 'var(--semi-color-fill-0)',
                    padding: 12,
                    borderRadius: 8,
                    overflow: 'auto',
                    maxHeight: 400,
                    fontSize: 13,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {data.input_content ? formatJson(data.input_content) : t('无输入内容')}
                </pre>
              </Collapsible.Body>
            </Collapsible>

            <Collapsible defaultOpen>
              <Collapsible.Header>
                <Title heading={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t('输出内容')}
                  {data.output_content && (
                    <Button
                      icon={<IconCopy />}
                      size='small'
                      onClick={() => copyToClipboard(data.output_content)}
                    />
                  )}
                </Title>
              </Collapsible.Header>
              <Collapsible.Body>
                <pre
                  style={{
                    background: 'var(--semi-color-fill-0)',
                    padding: 12,
                    borderRadius: 8,
                    overflow: 'auto',
                    maxHeight: 400,
                    fontSize: 13,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {data.output_content || t('无输出内容')}
                </pre>
              </Collapsible.Body>
            </Collapsible>
          </div>
        )}
      </Spin>
    </SideSheet>
  );
}