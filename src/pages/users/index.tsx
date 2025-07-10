import { useState, useMemo, useEffect } from "react";
import { Table, Input, Avatar, Typography, Card, Space, Button, message } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users";
import { UserData } from "services/users/interface";

const { Title } = Typography;

interface UsersTableData extends UserData {
  key: string;
  fullName: string;
}

interface TextFilterDropdownProps {
  placeholder: string;
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
}

const TextFilterDropdown = ({
  placeholder,
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
}: TextFilterDropdownProps) => (
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
        Search
      </Button>
      <Button
        onClick={() => {
          clearFilters?.();
          confirm();
        }}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </Space>
  </div>
);

export function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);

  const skip = (currentPage - 1) * pageSize;
  const { data, isLoading, isError } = useGetUsers(pageSize, skip);

  // Handle error feedback
  useEffect(() => {
    if (isError) {
      message.error('Failed to load users data');
    }
  }, [isError]);

  const tableData: UsersTableData[] = useMemo(() => {
    if (!data?.users) return [];

    return data.users.map(user => ({
      ...user,
      key: user.id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
    }));
  }, [data?.users]);

  const columns: ColumnsType<UsersTableData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 120,
      filterDropdown: (props) => (
        <TextFilterDropdown
          {...props}
          placeholder="Search first name"
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.firstName.toLowerCase().includes(value.toString().toLowerCase()),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 120,
      filterDropdown: (props) => (
        <TextFilterDropdown
          {...props}
          placeholder="Search last name"
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.lastName.toLowerCase().includes(value.toString().toLowerCase()),
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.image}
            icon={<UserOutlined />}
            size="small"
          />
          <span>{text}</span>
        </Space>
      ),
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['descend', 'ascend'],
      render: (email) => <Typography.Text copyable>{email}</Typography.Text>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => (
        <Avatar
          src={image}
          size={40}
          icon={<UserOutlined />}
          alt={`${record.firstName} ${record.lastName}`}
        />
      ),
    },
  ];

  const handleTableChange: TableProps<UsersTableData>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (pagination) {
      setCurrentPage(pagination.current || 1);
      setPageSize(pagination.pageSize || 13);
    }
  };

  return (
    <ContentLayout>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>Users</Title>

        <Table<UsersTableData>
          columns={columns}
          dataSource={tableData}
          loading={{
            spinning: isLoading,
            tip: "Fetching users...",
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ['13', '25', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          size="middle"
          bordered
          showSorterTooltip={{
            title: 'Click to sort',
          }}
        />
      </Card>
    </ContentLayout>
  );
}