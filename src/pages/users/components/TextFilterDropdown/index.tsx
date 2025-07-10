import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import { useIntl } from "react-intl";

interface TextFilterDropdownProps {
  placeholder: string;
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
}

export function TextFilterDropdown({
  placeholder,
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
}: TextFilterDropdownProps) {
  const { formatMessage } = useIntl();

  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          {formatMessage({ id: "page.users.filter.button.search" })}
        </Button>
        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          {formatMessage({ id: "page.users.filter.button.reset" })}
        </Button>
      </Space>
    </div>
  );
}