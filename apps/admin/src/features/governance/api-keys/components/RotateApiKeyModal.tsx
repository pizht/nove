import Modal from 'antd/es/modal';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import theme from 'antd/es/theme';
import Alert from 'antd/es/alert';
import Typography from 'antd/es/typography';
import { CopyOutlined } from '@ant-design/icons';
import type { RotateApiKeyResult } from '../types';

const { Paragraph } = Typography;

interface RotateApiKeyModalProps {
  open: boolean;
  onCancel: () => void;
  result?: RotateApiKeyResult;
  onCopyComplete?: () => void;
}

export function RotateApiKeyModal({
  open,
  onCancel,
  result,
  onCopyComplete,
}: RotateApiKeyModalProps) {
  const { token } = theme.useToken();
  const handleCopyKey = () => {
    if (result?.key) {
      navigator.clipboard.writeText(result.key);
      message.success('API Key 已复制到剪贴板');
      onCopyComplete?.();
    }
  };

  return (
    <Modal
      title="轮换 API Key 成功"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="copy" type="primary" icon={<CopyOutlined />} onClick={handleCopyKey}>
          复制 API Key
        </Button>,
      ]}
      width={600}
    >
      {result && (
        <div style={{ padding: '20px 0' }}>
          <Alert
            showIcon
            type="warning"
            title="请立即复制您的新 API Key，它只会显示这一次！"
            style={{ marginBottom: 16 }}
          />
          <div
            style={{
              padding: 12,
              backgroundColor: token.colorFillTertiary,
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 14,
              wordBreak: 'break-all',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span>{result.key}</span>
          </div>
          <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 12 }}>
            <p>• ID: {result.id}</p>
            <p>• 名称: {result.name}</p>
            <p>• 前缀: {result.prefix}</p>
            <p>• 状态: {result.status}</p>
          </Paragraph>
        </div>
      )}
    </Modal>
  );
}
